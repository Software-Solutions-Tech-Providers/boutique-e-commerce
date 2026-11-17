@echo off
rem Cross-compile raisfast for Raspberry Pi Zero 2 W (32-bit ARM, musl, static-ish)
rem Features: SQLite only, search, openapi. No S3/IMAP/stream/plugins (avoids OpenSSL/aws-lc).
set RUSTUP_HOME=C:\rust\rustup
set CARGO_HOME=C:\rust\cargo
set PATH=C:\winlibs\mingw64\bin;C:\rust\cargo\bin;%LOCALAPPDATA%\Microsoft\WinGet\Links;%PATH%
set PROTOC=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Google.Protobuf_Microsoft.Winget.Source_8wekyb3d8bbwe\bin\protoc.exe
set SQLX_OFFLINE=true
cargo zigbuild --release --target armv7-unknown-linux-musleabihf -p raisfast --no-default-features --features db-sqlite,search-tantivy,openapi
