# Christian Motivator – Electron Desktop App

This is a desktop build of the Christian Motivator (Electron + Vite + Tailwind).

## Dev run
```bash
npm install
npm run dev
```
- This runs Vite on http://localhost:5173 and launches Electron to that URL.

## Build Windows Installer (.exe)
```bash
npm run dist
```
- Produces an NSIS installer under `release/` (e.g., `Christian-Motivator-Setup-x.x.x.exe`).
- No code signing is required for local use. Windows SmartScreen may warn; choose "More info" → "Run anyway".

## Notes
- App bundles the compiled Vite `dist/` and loads it in Electron.
- If you want a custom icon, replace `build/icon.ico` before running `npm run dist`.
- All data is stored locally (LocalStorage). No accounts or servers required.
