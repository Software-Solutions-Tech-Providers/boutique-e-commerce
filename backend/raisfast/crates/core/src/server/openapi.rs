//! OpenAPI specification and Swagger UI configuration
//!
//! Uses `utoipa` to auto-generate OpenAPI 3.0 specs from handler annotations,
//! served via `/api/docs/openapi.json` as JSON spec,
//! and `/api/docs` redirects to the online Swagger UI.

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use utoipa::OpenApi;

use crate::dto;

/// OpenAPI specification definition
///
/// Auto-collected from handler `#[utoipa::path]` annotations and DTO `ToSchema` implementations.
#[derive(OpenApi)]
#[openapi(
    paths(
        crate::handlers::health::health,
        crate::handlers::health::liveness,
        crate::handlers::health::readiness,
        crate::handlers::auth::register,
        crate::handlers::auth::login,
        crate::handlers::auth::refresh,
        crate::handlers::auth::logout,
        crate::handlers::auth::forgot_password,
        crate::handlers::auth::reset_password,
        crate::handlers::auth::set_password,
        crate::handlers::api_token::create,
        crate::handlers::api_token::list,
        crate::handlers::api_token::delete,
        crate::handlers::user::get_me,
        crate::handlers::user::update_me,
        crate::handlers::user::change_password,
        crate::handlers::user::list_users,
        crate::handlers::user::get_user,
        crate::handlers::user::update_role,
        crate::handlers::category::list,
        crate::handlers::category::create,
        crate::handlers::category::update,
        crate::handlers::category::delete,
        crate::handlers::tag::list,
        crate::handlers::tag::create,
        crate::handlers::tag::update,
        crate::handlers::tag::delete,
        crate::handlers::post::list,
        crate::handlers::post::get,
        crate::handlers::post::create,
        crate::handlers::post::update,
        crate::handlers::post::delete,
        crate::handlers::comment::list,
        crate::handlers::comment::list_all,
        crate::handlers::comment::create,
        crate::handlers::comment::create_guest,
        crate::handlers::comment::delete,
        crate::handlers::comment::update_status,
        crate::handlers::comment::admin_list,
        crate::handlers::comment::admin_update_status,
        crate::handlers::comment::admin_delete,
        crate::handlers::comment::admin_batch,
        crate::handlers::media::upload,
        crate::handlers::media::list,
        crate::handlers::media::delete,
        crate::handlers::media::stats,
        crate::handlers::media::admin_upload,
        crate::handlers::media::admin_list,
        crate::handlers::media::admin_delete,
        crate::handlers::media::admin_batch,
        crate::handlers::page::list,
        crate::handlers::page::get_by_slug,
        crate::handlers::page::sitemap,
        crate::handlers::page::admin_list,
        crate::handlers::page::admin_get,
        crate::handlers::page::create,
        crate::handlers::page::update,
        crate::handlers::page::delete,
        crate::handlers::page::update_status,
        crate::handlers::page::reorder,
        crate::handlers::page::admin_batch,
        crate::handlers::reusable_block::list_reusable,
        crate::handlers::reusable_block::get_reusable,
        crate::handlers::reusable_block::create_reusable,
        crate::handlers::reusable_block::update_reusable,
        crate::handlers::reusable_block::delete_reusable,
        crate::handlers::reusable_block::admin_batch,
        crate::handlers::rbac::list_roles,
        crate::handlers::rbac::create_role,
        crate::handlers::rbac::update_role,
        crate::handlers::rbac::delete_role,
        crate::handlers::rbac::get_permissions,
        crate::handlers::rbac::set_permissions,
        crate::handlers::rbac::admin_batch,
        crate::handlers::tenant::list_tenants,
        crate::handlers::tenant::get_tenant,
        crate::handlers::tenant::create_tenant,
        crate::handlers::tenant::update_tenant,
        crate::handlers::tenant::delete_tenant,
        crate::handlers::tenant::admin_batch,
        crate::handlers::options::get_public_options,
        crate::handlers::options::list_options,
        crate::handlers::options::get_option,
        crate::handlers::options::update_options,
        crate::handlers::options::set_option,
        crate::handlers::options::delete_option,
        crate::handlers::product::list_active,
        crate::handlers::product::get_product,
        crate::handlers::product::admin_list,
        crate::handlers::product::admin_create,
        crate::handlers::product::admin_update,
        crate::handlers::product::admin_delete,
        crate::handlers::order::create_order,
        crate::handlers::order::list_orders,
        crate::handlers::order::get_order,
        crate::handlers::order::cancel_order_handler,
        crate::handlers::order::confirm_receipt,
        crate::handlers::order::admin_list,
        crate::handlers::order::admin_get,
        crate::handlers::order::admin_ship,
        crate::handlers::order::admin_cancel,
        crate::handlers::order::admin_pay,
        crate::handlers::order::admin_refund,
        crate::handlers::order::admin_update_remark,
        crate::handlers::order::admin_stats,
        crate::handlers::payment::create_payment_order_handler,
        crate::handlers::payment::list_user_orders,
        crate::handlers::payment::get_payment_order_handler,
        crate::handlers::payment::cancel_payment_order_handler,
        crate::handlers::payment::list_order_transactions,
        crate::handlers::payment::list_order_refunds,
        crate::handlers::payment::handle_callback,
        crate::handlers::payment::list_available_channels_handler,
        crate::handlers::payment::admin_list_channels,
        crate::handlers::payment::admin_create_channel,
        crate::handlers::payment::admin_get_channel,
        crate::handlers::payment::admin_update_channel,
        crate::handlers::payment::admin_delete_channel,
        crate::handlers::payment::admin_list_orders,
        crate::handlers::payment::admin_get_order,
        crate::handlers::payment::admin_refund_order,
        crate::handlers::payment::admin_list_transactions,
        crate::handlers::payment::admin_list_refunds,
        crate::handlers::wallet::list_wallets,
        crate::handlers::wallet::get_wallet,
        crate::handlers::wallet::list_transactions,
        crate::handlers::wallet::list_all_transactions,
        crate::handlers::wallet::list_all_wallets,
        crate::handlers::wallet::list_all_transactions_admin,
        crate::handlers::wallet::admin_credit,
        crate::handlers::wallet::admin_debit,
        crate::handlers::wallet::list_user_transactions,
        crate::handlers::wallet::list_user_all_transactions,
        crate::handlers::wallet::admin_reversal,
        crate::handlers::stats::overview,
        crate::handlers::stats::content_stats,
        crate::handlers::stats::trends,
        crate::handlers::oauth::redirect_to_provider,
        crate::handlers::oauth::callback,
        crate::handlers::oauth::list_providers,
        crate::handlers::oauth::list_bindings,
        crate::handlers::oauth::unbind,
        crate::handlers::cron::list,
        crate::handlers::cron::get,
        crate::handlers::cron::create,
        crate::handlers::cron::update,
        crate::handlers::cron::toggle,
        crate::handlers::cron::delete,
        crate::handlers::cron::logs,
        crate::handlers::cron::cleanup_logs,
        crate::handlers::cron::admin_batch,
        crate::handlers::jobs::list,
        crate::handlers::jobs::stats,
        crate::handlers::jobs::types,
        crate::handlers::jobs::retry,
        crate::handlers::jobs::remove,
        crate::handlers::jobs::cleanup,
        crate::handlers::currencies::list_currencies,
        crate::handlers::currencies::get_currency,
        crate::handlers::currencies::create_currency,
        crate::handlers::currencies::update_currency,
        crate::handlers::rss::feed,
        crate::handlers::content_revision::list_revisions,
        crate::handlers::content_revision::get_revision,
        crate::handlers::content_revision::restore_revision,
        crate::handlers::content_revision::diff_revisions,
        crate::handlers::plugin::list,
        crate::handlers::plugin::get,
        crate::handlers::plugin::enable,
        crate::handlers::plugin::disable,
        crate::handlers::plugin::reload,
        crate::handlers::plugin::remove,
        crate::handlers::plugin::admin_batch,
    ),
    components(
        schemas(
            dto::RegisterRequest,
            dto::LoginRequest,
            dto::RefreshRequest,
            dto::UpdateUserRequest,
            dto::UpdatePasswordRequest,
            dto::UpdateRoleRequest,
            dto::UserResponse,
            dto::LoginResponse,
            dto::CreatePostRequest,
            dto::UpdatePostRequest,
            dto::PostResponse,
            dto::CreateCategoryRequest,
            dto::UpdateCategoryRequest,
            dto::CreateTagRequest,
            dto::CreateCommentRequest,
            dto::UpdateCommentStatusRequest,
            dto::MediaResponse,
            dto::CreateTokenRequest,
            crate::models::post::TagBrief,
        )
    ),
    modifiers(&SecurityAddon),
    tags(
        (name = "health", description = "Health Check"),
        (name = "auth", description = "Authentication"),
        (name = "tokens", description = "API Token Management"),
        (name = "users", description = "Users"),
        (name = "posts", description = "Posts"),
        (name = "categories", description = "Categories"),
        (name = "tags", description = "Tags"),
        (name = "comments", description = "Comments"),
        (name = "media", description = "Media"),
        (name = "pages", description = "Pages"),
        (name = "reusable_blocks", description = "Reusable Blocks"),
        (name = "rbac", description = "RBAC"),
        (name = "tenants", description = "Tenants"),
        (name = "options", description = "Options"),
        (name = "products", description = "Products"),
        (name = "orders", description = "Orders"),
        (name = "payments", description = "Payments"),
        (name = "wallets", description = "Wallets"),
        (name = "stats", description = "Statistics"),
        (name = "oauth", description = "OAuth"),
        (name = "cron", description = "Cron Schedules"),
        (name = "currencies", description = "Currencies"),
        (name = "rss", description = "RSS"),
        (name = "revisions", description = "Content Revisions"),
        (name = "plugins", description = "Plugins"),
    )
)]
pub struct ApiDoc;

/// JWT Bearer Auth security scheme
struct SecurityAddon;

impl utoipa::Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "bearer_auth",
                utoipa::openapi::security::SecurityScheme::Http(
                    utoipa::openapi::security::Http::new(
                        utoipa::openapi::security::HttpAuthScheme::Bearer,
                    ),
                ),
            );
        }

        let server = utoipa::openapi::ServerBuilder::new()
            .url("/")
            .description(Some("Current host"))
            .build();
        openapi.servers = Some(vec![server]);

        let prefix = crate::constants::API_PREFIX;
        let paths = std::mem::take(&mut openapi.paths.paths);
        for (path, item) in paths {
            let full_path = if path.starts_with(prefix) {
                path
            } else {
                format!("{prefix}{path}")
            };
            openapi.paths.paths.insert(full_path, item);
        }
    }
}

/// Serve the OpenAPI JSON specification
pub async fn serve_openapi_json(state: crate::AppState) -> Response {
    let spec = ApiDoc::openapi();
    let mut doc = serde_json::to_value(&spec).unwrap_or_else(|_| serde_json::json!({}));
    // PATCHED: the utoipa spec is compile-time only, so it misses (a) routes
    // registered without a #[utoipa::path] (cart, product categories, variants…)
    // and (b) every runtime content type (`/api/v1/cms/{group}/{plural}`).
    // Merge both from live runtime state.
    dynamic_docs::merge(&mut doc, &state);
    let json = serde_json::to_string_pretty(&doc).unwrap_or_default();
    (StatusCode::OK, [("Content-Type", "application/json")], json).into_response()
}

/// PATCHED: runtime additions to the OpenAPI document.
mod dynamic_docs {
    use crate::content_type::schema::{ApiAccess, ContentKind, ContentTypeSchema, FieldType};
    use serde_json::{Map, Value, json};

    const API: &str = crate::constants::API_PREFIX;

    pub fn merge(doc: &mut Value, state: &crate::AppState) {
        if !doc["paths"].is_object() {
            doc["paths"] = json!({});
        }
        ensure_security_scheme(doc);
        add_tenant_header_component(doc);
        for ct in state.content_type_registry.all() {
            add_content_type(doc, &ct);
        }
        add_registry_routes(doc, state);
    }

    fn ensure_security_scheme(doc: &mut Value) {
        let schemes = &mut doc["components"]["securitySchemes"];
        if schemes.get("bearer_auth").is_none() {
            schemes["bearer_auth"] = json!({"type": "http", "scheme": "bearer", "bearerFormat": "JWT"});
        }
    }

    fn add_tenant_header_component(doc: &mut Value) {
        doc["components"]["parameters"]["XTenantId"] = json!({
            "name": "X-Tenant-ID", "in": "header", "required": false,
            "description": "Tenant (shop) to read/write, e.g. `shop1`. Anonymous callers default to `default`; logged-in non-admin users always use the tenant in their token.",
            "schema": {"type": "string"}
        });
    }

    fn insert_op(doc: &mut Value, path: &str, method: &str, op: Value) {
        let item = doc["paths"]
            .as_object_mut()
            .expect("paths is an object")
            .entry(path.to_owned())
            .or_insert_with(|| json!({}));
        if item.get(method).is_none() {
            item[method] = op;
        }
    }

    fn path_params(path: &str) -> Vec<Value> {
        path.split('/')
            .filter_map(|seg| seg.strip_prefix('{').and_then(|s| s.strip_suffix('}')))
            .filter(|name| !name.starts_with('*'))
            .map(|name| json!({"name": name, "in": "path", "required": true, "schema": {"type": "string"}}))
            .collect()
    }

    fn security_for(access: ApiAccess) -> Option<Value> {
        match access {
            ApiAccess::Public => Some(json!([])),
            ApiAccess::None => None,
            _ => Some(json!([{"bearer_auth": []}])),
        }
    }

    fn access_note(access: ApiAccess) -> &'static str {
        match access {
            ApiAccess::Public => "Public (no login).",
            ApiAccess::Authed => "Requires login (any role).",
            ApiAccess::Owner => "Requires login; only the record's creator.",
            ApiAccess::Admin => "Requires admin.",
            ApiAccess::None => "Disabled.",
        }
    }

    fn field_schema(ft: &FieldType, enum_values: Option<&Vec<String>>) -> Value {
        match ft {
            FieldType::Integer | FieldType::BigInt => json!({"type": "integer"}),
            FieldType::Decimal | FieldType::Float => json!({"type": "number"}),
            FieldType::Boolean => json!({"type": "boolean"}),
            FieldType::Date => json!({"type": "string", "format": "date"}),
            FieldType::DateTime => json!({"type": "string", "format": "date-time"}),
            FieldType::Email => json!({"type": "string", "format": "email"}),
            FieldType::Password => json!({"type": "string", "format": "password", "writeOnly": true}),
            FieldType::Json => json!({"type": "object"}),
            FieldType::MediaSet => json!({"type": "array", "items": {"type": "string"}}),
            FieldType::Blob => json!({"type": "string", "format": "binary"}),
            FieldType::Enum => match enum_values {
                Some(v) => json!({"type": "string", "enum": v}),
                None => json!({"type": "string"}),
            },
            _ => json!({"type": "string"}),
        }
    }

    /// Component schemas `<Name>` (response) and `<Name>Input` (request body).
    fn add_ct_schemas(doc: &mut Value, ct: &ContentTypeSchema, base: &str) {
        let mut props = Map::new();
        let mut input = Map::new();
        let mut required = Vec::new();
        props.insert("id".into(), json!({"type": "string"}));
        for f in &ct.fields {
            let mut s = field_schema(&f.field_type, f.enum_values.as_ref());
            if let Some(d) = f.description.as_ref().or(f.label.as_ref()) {
                s["description"] = json!(d);
            }
            if let Some(m) = f.max_length {
                s["maxLength"] = json!(m);
            }
            if !f.private && !matches!(f.field_type, FieldType::Password) {
                props.insert(f.name.clone(), s.clone());
            }
            if !f.immutable {
                input.insert(f.name.clone(), s);
                if f.required {
                    required.push(f.name.clone());
                }
            }
        }
        if ct.implements.iter().any(|p| p.name() == "statusable") {
            props.insert("status".into(), json!({"type": "string"}));
            input.insert("status".into(), json!({"type": "string"}));
        }
        if ct.implements.iter().any(|p| p.name() == "timestampable") {
            props.insert("created_at".into(), json!({"type": "string", "format": "date-time"}));
            props.insert("updated_at".into(), json!({"type": "string", "format": "date-time"}));
        }
        let schemas = &mut doc["components"]["schemas"];
        schemas[base] = json!({"type": "object", "properties": props});
        schemas[format!("{base}Input")] =
            json!({"type": "object", "properties": input, "required": required});
    }

    fn ok_body(data: Value) -> Value {
        json!({"200": {"description": "Success", "content": {"application/json": {"schema": {
            "type": "object",
            "properties": {"code": {"type": "integer", "example": 0}, "message": {"type": "string"}, "data": data}
        }}}}})
    }

    fn add_content_type(doc: &mut Value, ct: &ContentTypeSchema) {
        let base: String = ct
            .singular
            .split(['_', '-'])
            .map(|w| {
                let mut c = w.chars();
                c.next().map(|f| f.to_ascii_uppercase().to_string() + c.as_str()).unwrap_or_default()
            })
            .collect();
        let base = format!("Cms{base}");
        add_ct_schemas(doc, ct, &base);
        let item_ref = json!({"$ref": format!("#/components/schemas/{base}")});
        let input_ref = json!({"$ref": format!("#/components/schemas/{base}Input")});
        let list_data = json!({"type": "object", "properties": {
            "items": {"type": "array", "items": item_ref},
            "total": {"type": "integer"}, "page": {"type": "integer"}, "page_size": {"type": "integer"}}});
        let tag = format!("CMS: {}", ct.name);
        let tenant = ct.implements.iter().any(|p| p.name() == "tenantable");
        let tenant_note = if tenant {
            " Data is per tenant: send `X-Tenant-ID`."
        } else {
            " Not tenant-scoped: records are shared by all tenants."
        };
        let group = if ct.group.is_empty() { String::new() } else { format!("/{}", ct.group) };
        let header = json!({"$ref": "#/components/parameters/XTenantId"});
        let list_params = vec![
            header.clone(),
            json!({"name": "page", "in": "query", "schema": {"type": "integer"}}),
            json!({"name": "page_size", "in": "query", "schema": {"type": "integer"}}),
            json!({"name": "sort", "in": "query", "description": "Field name; prefix `-` for descending", "schema": {"type": "string"}}),
            json!({"name": "status", "in": "query", "schema": {"type": "string"}}),
            json!({"name": "search", "in": "query", "schema": {"type": "string"}}),
            json!({"name": "filter", "in": "query", "description": "Rule expression, e.g. `status = \"published\"`", "schema": {"type": "string"}}),
            json!({"name": "include", "in": "query", "description": "Relations to expand (comma separated)", "schema": {"type": "string"}}),
        ];

        let op = |summary: String, access: ApiAccess, params: Vec<Value>, body: Option<&Value>, data: Value| -> Option<Value> {
            let security = security_for(access)?;
            let mut o = json!({
                "tags": [tag.clone()],
                "summary": summary,
                "description": format!("{}{}", access_note(access), tenant_note),
                "parameters": params,
                "security": security,
                "responses": ok_body(data),
            });
            if let Some(b) = body {
                o["requestBody"] = json!({"required": true, "content": {"application/json": {"schema": b}}});
            }
            Some(o)
        };

        if ct.kind == ContentKind::Single {
            let p = format!("{API}/cms{group}/{}", ct.singular);
            if let Some(o) = op(format!("Get {}", ct.name), ct.api.get.access, vec![header.clone()], None, item_ref.clone()) {
                insert_op(doc, &p, "get", o);
            }
            if let Some(o) = op(format!("Update {}", ct.name), ct.api.update.access, vec![header.clone()], Some(&input_ref), item_ref.clone()) {
                insert_op(doc, &p, "put", o);
            }
            return;
        }

        let coll = format!("{API}/cms{group}/{}", ct.plural);
        let one = format!("{coll}/{{id}}");
        let mut id_params = path_params(&one);
        id_params.insert(0, header.clone());
        if let Some(o) = op(format!("List {}", ct.name), ct.api.list.access, list_params, None, list_data.clone()) {
            insert_op(doc, &coll, "get", o);
        }
        if let Some(o) = op(format!("Create {}", ct.name), ct.api.create.access, vec![header.clone()], Some(&input_ref), item_ref.clone()) {
            insert_op(doc, &coll, "post", o);
        }
        if let Some(o) = op(format!("Get one {}", ct.name), ct.api.get.access, id_params.clone(), None, item_ref.clone()) {
            insert_op(doc, &one, "get", o);
        }
        if let Some(o) = op(format!("Update {}", ct.name), ct.api.update.access, id_params.clone(), Some(&input_ref), item_ref.clone()) {
            insert_op(doc, &one, "put", o);
        }
        if let Some(o) = op(format!("Delete {}", ct.name), ct.api.delete.access, id_params, None, json!(null)) {
            insert_op(doc, &one, "delete", o);
        }

        // Admin CMS endpoints (no access rules / filters; admin only)
        let admin_tag = format!("CMS (admin): {}", ct.name);
        let admin_coll = format!("{API}/admin/cms{group}/{}", ct.plural);
        let admin_one = format!("{admin_coll}/{{id}}");
        let sec = json!([{"bearer_auth": []}]);
        let mk = |summary: &str, params: Vec<Value>, body: Option<&Value>, data: Value| {
            let mut o = json!({"tags": [admin_tag.clone()], "summary": summary, "parameters": params,
                "security": sec.clone(), "responses": ok_body(data)});
            if let Some(b) = body {
                o["requestBody"] = json!({"required": true, "content": {"application/json": {"schema": b}}});
            }
            o
        };
        let mut admin_id = path_params(&admin_one);
        admin_id.insert(0, header.clone());
        insert_op(doc, &admin_coll, "get", mk(&format!("Admin list {}", ct.name), vec![header.clone()], None, list_data));
        insert_op(doc, &admin_coll, "post", mk(&format!("Admin create {}", ct.name), vec![header.clone()], Some(&input_ref), item_ref.clone()));
        insert_op(doc, &admin_one, "get", mk(&format!("Admin get {}", ct.name), admin_id.clone(), None, item_ref.clone()));
        insert_op(doc, &admin_one, "put", mk(&format!("Admin update {}", ct.name), admin_id.clone(), Some(&input_ref), item_ref));
        insert_op(doc, &admin_one, "delete", mk(&format!("Admin delete {}", ct.name), admin_id, None, json!(null)));
    }

    /// Routes known to the runtime route registry but absent from the
    /// compile-time spec (e.g. cart, product categories, variants).
    fn add_registry_routes(doc: &mut Value, state: &crate::AppState) {
        for r in state.route_registry.iter() {
            if r.path.contains("{*") || !r.path.starts_with(API) {
                continue; // catch-alls are expanded per content type above
            }
            let method = r.method.to_ascii_lowercase();
            if !["get", "post", "put", "delete", "patch"].contains(&method.as_str()) {
                continue;
            }
            let exists = doc["paths"].get(&r.path).and_then(|p| p.get(&method)).is_some();
            if exists {
                continue;
            }
            let (security, note) = match r.permission.as_deref() {
                Some("public") => (json!([]), "Public."),
                Some("admin") => (json!([{"bearer_auth": []}]), "Requires admin."),
                Some("authed") => (json!([{"bearer_auth": []}]), "Requires login."),
                Some(_) => (json!([{"bearer_auth": []}]), "Requires login / API token scope."),
                None if r.path.contains("/admin/") => (json!([{"bearer_auth": []}]), "Requires admin."),
                None => (json!([]), "Access decided by the handler (login may be required)."),
            };
            let mut params = path_params(&r.path);
            params.insert(0, json!({"$ref": "#/components/parameters/XTenantId"}));
            let mut op = json!({
                "tags": [if r.source_name.is_empty() { r.source.clone() } else { r.source_name.clone() }],
                "summary": format!("{} {}", r.method, r.path.trim_start_matches(API)),
                "description": format!("{note} (Auto-documented from the live route table; request/response schema not annotated upstream.)"),
                "parameters": params,
                "security": security,
                "responses": {"200": {"description": "Success"}},
            });
            if matches!(method.as_str(), "post" | "put" | "patch") {
                op["requestBody"] = json!({"content": {"application/json": {"schema": {"type": "object"}}}});
            }
            let item = doc["paths"]
                .as_object_mut()
                .expect("paths is an object")
                .entry(r.path.clone())
                .or_insert_with(|| json!({}));
            item[method] = op;
        }
    }
}

/// Serve Scalar API documentation UI (only compiled when `openapi` feature is enabled)
#[cfg(feature = "openapi")]
pub async fn serve_scalar_ui() -> impl IntoResponse {
    let html = r#"<!DOCTYPE html>
<html>
<head>
    <title>RaisFast API Docs</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        body { margin: 0; }
        #login-bar {
            display: flex; align-items: center; gap: 8px;
            padding: 8px 16px; background: #1a1a2e; color: #eee;
            font-family: system-ui, sans-serif; font-size: 14px;
            position: sticky; top: 0; z-index: 9999;
        }
        #login-bar input {
            padding: 6px 10px; border: 1px solid #444; border-radius: 4px;
            background: #222; color: #eee; font-size: 13px;
        }
        #login-bar button {
            padding: 6px 16px; border: none; border-radius: 4px;
            background: #6366f1; color: #fff; cursor: pointer; font-size: 13px;
        }
        #login-bar button:hover { background: #4f46e5; }
        #login-bar .status { margin-left: 8px; font-size: 12px; }
        #login-bar .ok { color: #4ade80; }
        #login-bar .err { color: #f87171; }
    </style>
</head>
<body>
    <div id="login-bar">
        <span>Quick Login:</span>
        <input id="email" type="email" placeholder="Email" value="admin@raisfast.dev" style="width:180px" />
        <input id="password" type="password" placeholder="Password" value="admin123" style="width:140px" />
        <button onclick="doLogin()">Login</button>
        <span id="status" class="status"></span>
    </div>
    <div id="scalar-container"></div>
    <script>
    async function doLogin() {
        const s = document.getElementById('status');
        s.textContent = 'Logging in...'; s.className = 'status';
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            const token = data.access_token || data.data?.access_token;
            if (!token) throw new Error('No token in response');
            localStorage.setItem('raisfast_token', token);
            s.textContent = 'Token saved'; s.className = 'status ok';
            applyToken(token);
        } catch (e) {
            s.textContent = 'Failed: ' + e.message; s.className = 'status err';
        }
    }
    function applyToken(token) {
        const evt = new CustomEvent('scalar-update-auth', {
            detail: { authKey: 'bearer_auth', token: 'Bearer ' + token }
        });
        window.dispatchEvent(evt);
    }
    </script>
    <script id="api-reference" data-url="/api/docs/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>"#;
    ([("Content-Type", "text/html; charset=utf-8")], html).into_response()
}
