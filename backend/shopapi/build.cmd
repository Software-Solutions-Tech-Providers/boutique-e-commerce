@echo off
rem Cross-compile for Raspberry Pi Zero 2 W (32-bit ARM, musl, static)
set RUSTUP_HOME=C:\rust\rustup
set CARGO_HOME=C:\rust\cargo
set PATH=C:\winlibs\mingw64\bin;C:\rust\cargo\bin;%LOCALAPPDATA%\Microsoft\WinGet\Links;%PATH%
cargo zigbuild --release --target armv7-unknown-linux-musleabihf
