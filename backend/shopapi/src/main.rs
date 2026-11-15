use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    routing::get,
    Json, Router,
};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Clone)]
struct App {
    db: Arc<Mutex<Connection>>,
    admin_token: Arc<String>,
}

#[derive(Serialize)]
struct Product {
    id: i64,
    name: String,
    price_paise: i64,
    stock: i64,
}

#[derive(Deserialize)]
struct NewProduct {
    name: String,
    price_paise: i64,
    stock: i64,
}

fn open_db(path: &str) -> rusqlite::Result<Connection> {
    let c = Connection::open(path)?;
    c.execute_batch(
        "PRAGMA journal_mode=WAL;
         PRAGMA synchronous=FULL;
         PRAGMA busy_timeout=5000;
         PRAGMA foreign_keys=ON;
         PRAGMA cache_size=-4000;",
    )?;
    migrate(&c)?;
    Ok(c)
}

fn migrate(c: &Connection) -> rusqlite::Result<()> {
    let v: i64 = c.query_row("PRAGMA user_version", [], |r| r.get(0))?;
    if v < 1 {
        c.execute_batch(
            "CREATE TABLE products (
               id INTEGER PRIMARY KEY,
               name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 200),
               price_paise INTEGER NOT NULL CHECK(price_paise >= 0),
               stock INTEGER NOT NULL CHECK(stock >= 0)
             );
             PRAGMA user_version = 1;",
        )?;
    }
    Ok(())
}

async fn db<T: Send + 'static>(
    app: &App,
    f: impl FnOnce(&Connection) -> rusqlite::Result<T> + Send + 'static,
) -> Result<T, StatusCode> {
    let conn = app.db.clone();
    tokio::task::spawn_blocking(move || f(&conn.lock().unwrap()))
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .map_err(|e| {
            eprintln!("db error: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })
}

async fn healthz(State(app): State<App>) -> Result<&'static str, StatusCode> {
    db(&app, |c| c.query_row("SELECT 1", [], |_| Ok(()))).await?;
    Ok("ok")
}

async fn list(State(app): State<App>) -> Result<Json<Vec<Product>>, StatusCode> {
    let rows = db(&app, |c| {
        let mut s = c.prepare_cached("SELECT id,name,price_paise,stock FROM products ORDER BY id LIMIT 200")?;
        let it = s.query_map([], |r| {
            Ok(Product { id: r.get(0)?, name: r.get(1)?, price_paise: r.get(2)?, stock: r.get(3)? })
        })?;
        it.collect()
    })
    .await?;
    Ok(Json(rows))
}

async fn get_one(State(app): State<App>, Path(id): Path<i64>) -> Result<Json<Product>, StatusCode> {
    let row = db(&app, move |c| {
        c.prepare_cached("SELECT id,name,price_paise,stock FROM products WHERE id=?1")?
            .query_row([id], |r| {
                Ok(Product { id: r.get(0)?, name: r.get(1)?, price_paise: r.get(2)?, stock: r.get(3)? })
            })
            .map(Some)
            .or_else(|e| match e {
                rusqlite::Error::QueryReturnedNoRows => Ok(None),
                e => Err(e),
            })
    })
    .await?;
    row.map(Json).ok_or(StatusCode::NOT_FOUND)
}

async fn create(
    State(app): State<App>,
    headers: HeaderMap,
    Json(p): Json<NewProduct>,
) -> Result<(StatusCode, Json<serde_json::Value>), StatusCode> {
    let ok = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .map(|v| v == format!("Bearer {}", app.admin_token))
        .unwrap_or(false);
    if !ok {
        return Err(StatusCode::UNAUTHORIZED);
    }
    if p.name.is_empty() || p.name.len() > 200 || p.price_paise < 0 || p.stock < 0 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    let id = db(&app, move |c| {
        c.prepare_cached("INSERT INTO products(name,price_paise,stock) VALUES(?1,?2,?3)")?
            .execute(params![p.name, p.price_paise, p.stock])?;
        Ok(c.last_insert_rowid())
    })
    .await?;
    Ok((StatusCode::CREATED, Json(serde_json::json!({ "id": id }))))
}

#[tokio::main(flavor = "multi_thread", worker_threads = 2)]
async fn main() {
    let path = std::env::var("DATABASE_PATH").unwrap_or_else(|_| "shop.db".into());
    let addr = std::env::var("LISTEN_ADDR").unwrap_or_else(|_| "127.0.0.1:8081".into());
    let admin_token = std::env::var("ADMIN_TOKEN").expect("ADMIN_TOKEN must be set");
    if admin_token.len() < 16 {
        panic!("ADMIN_TOKEN too short");
    }
    let app = App {
        db: Arc::new(Mutex::new(open_db(&path).expect("open db"))),
        admin_token: Arc::new(admin_token),
    };
    let router = Router::new()
        .route("/healthz", get(healthz))
        .route("/products", get(list).post(create))
        .route("/products/:id", get(get_one))
        .with_state(app);
    let l = tokio::net::TcpListener::bind(&addr).await.expect("bind");
    eprintln!("listening on {addr}");
    axum::serve(l, router).await.unwrap();
}
