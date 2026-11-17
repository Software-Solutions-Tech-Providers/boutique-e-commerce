# raisfast (vendored)

Vendored from https://github.com/RaisFast/raisfast at commit
`51379584c0ada2fc77efa947c46c6ab7fe1511ac` (v0.4.2). Upstream git history was
removed so this lives inside the boutique-e-commerce repo.

All local changes are recorded in `LOCAL-PATCHES.diff` (unified diff against the
upstream commit above, line endings normalised to LF). Every patched spot is
marked with a `PATCHED:` comment. To update raisfast later: take the new upstream
version, re-apply the diff, resolve conflicts, rebuild.

## Patches

### Build
- `crates/core/Cargo.toml`, `Cargo.lock`: reqwest without `native-tls` (OpenSSL)
  so it cross-compiles for the Raspberry Pi (armv7 musl).
- `crates/core/src/lib.rs`: `init_provider_extensions` is only defined with the
  JS plugin engine; gate the call on `rquickjs` so builds without it compile.

### Google SSO / auth
- `crates/core/src/oauth/google.rs`, `oauth.rs`, `lib.rs`: send `redirect_uri`
  on the authorize request and token exchange (Google rejected every login).
- `crates/core/src/handlers/oauth.rs`: callback `postMessage` restricted to the
  site origin (was `"*"`, leaking session tokens to any opener); full-page admin
  login now stores the session and redirects to `/admin`.
- `crates/core/src/services/oauth.rs`: SSO sign-up allowed only for verified
  emails listed in the `oauth_admin_emails` option (default tenant); those
  become `admin` on first login. Everyone else is refused, no account created.
- `crates/core/src/handlers/auth.rs`: self-registration into the `default`
  (platform) tenant is refused unless the caller is an admin.

### Multi-tenancy
- `crates/core/src/content_type/handler.rs`: list/get/create/update for
  `tenantable` content types now pass the caller's tenant (upstream passed
  `None`, so all tenants read/wrote `default`); list/detail cache keys include
  the tenant.
- `crates/core/src/services/tenant.rs`: a new tenant is provisioned with the
  default tenant's options and currencies (upstream created an empty tenant).
- `crates/core/src/handlers/tenant.rs`: create/update/delete/batch tenants only
  from the `default` tenant.
- `crates/core/src/llm/relay/auth.rs`: LLM key owner lookup falls back across
  tenants so super-admin keys work inside a shop.

### Content types
- `crates/core/src/content_type/schema.rs`, `handler.rs`: updating a content
  type's `group` is applied (was silently dropped while reporting success);
  the old registration/TOML file are retired, records kept.

### API docs
- `crates/core/src/server/openapi.rs`, `server.rs`: `/api/docs/openapi.json`
  is merged at request time with live state: every content type (CRUD paths,
  field-derived schemas, access rules, `X-Tenant-ID`) and every registered route
  the compile-time spec missed (cart, product categories, variants, …).

## Build for the Pi

`build-pi.cmd` (armv7 musl, features `db-sqlite,search-tantivy,openapi`).
Deployment files for the Pi live in `infra/pi/`.
