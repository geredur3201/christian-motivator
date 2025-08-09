# Christian Motivator – Electron Desktop App

This repository is CI-ready to build a **Windows .exe installer** via **GitHub Actions** —
so you don't need Node.js on your PC.

## One‑time setup (no terminal on your PC)
1. Create a new empty GitHub repo.
2. Upload all files from this folder (or drag & drop in GitHub web UI).
3. Go to **Actions** tab → enable workflows if prompted.
4. Trigger a run: **Actions → Build Windows Installer → Run workflow**.
5. After ~3–6 minutes, download the artifact **Christian-Motivator-Installer** → it contains `Christian-Motivator-Setup-<version>.exe`.
6. Double‑click the `.exe` to install. Done.

The workflow file is at `.github/workflows/build.yml`.

## Local dev (optional)
If you *do* have Node and want to run locally:
```bash
npm install
npm run dev
```
