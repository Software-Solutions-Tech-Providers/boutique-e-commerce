# raisfast (vendored)

Vendored from https://github.com/RaisFast/raisfast at commit `51379584c0ada2fc77efa947c46c6ab7fe1511ac`
(upstream git history removed so this lives inside the boutique-e-commerce repo).

Local changes on top of upstream are recorded in `LOCAL-PATCHES.diff`
(`git diff` against the upstream commit above). To update raisfast later:
clone upstream at the new version, re-apply this diff, resolve conflicts.

Patched files:
- crates/core/Cargo.toml, Cargo.lock — reqwest without native-tls (OpenSSL) for the Pi cross-build
- crates/core/src/lib.rs — gate init_provider_extensions on rquickjs; pass base_url to GoogleProvider
- crates/core/src/oauth/google.rs, crates/core/src/oauth.rs — send redirect_uri to Google (authorize + token exchange)
- crates/core/src/handlers/oauth.rs — callback: postMessage restricted to own origin; full-page admin login
- crates/core/src/llm/relay/auth.rs — LLM key owner lookup falls back across tenants

Build for the Pi: build-pi.cmd (armv7 musl, features db-sqlite,search-tantivy,openapi).
