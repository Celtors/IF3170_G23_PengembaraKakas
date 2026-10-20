# IF3170_G23_PengembaraKakas

Tugas Besar IF3170 Inteligensi Artifisial — **Truck Loading Optimizer**.
Aplikasi ini memuat paket-paket 3D ke dalam peti kemas truk agar nilai muatan maksimal tanpa melanggar batasan (dimensi, kapasitas berat, paket *fragile*), menggunakan algoritma *local search*:

- Hill-Climbing (Steepest Ascent, Sideways Move, Stochastic, Random Restart)
- Simulated Annealing
- Genetic Algorithm

Backend dibangun dengan **FastAPI** (Python), frontend dengan **React + Vite + TypeScript** dan visualisasi 3D hasil pemuatan. Hasil run dan eksperimen disimpan ke folder `output/`, dokumentasi algoritma dan analisis eksperimen ada di folder `docs/`.

## Struktur Repository

```
src/
├── backend/    # FastAPI: algoritma, model, objective function, API
└── frontend/   # React + Vite: konfigurasi, visualisasi, panel eksperimen
docs/           # Dokumentasi algoritma & hasil eksperimen
output/         # Hasil run & eksperimen (JSON)
```

## Cara Setup dan Menjalankan Program

### Prasyarat

- Python 3.11+
- Node.js 18+ dan npm

### 1. Backend

```bash
cd src/backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirement.txt
uvicorn app.main:app --reload --port 8000
```

Backend berjalan di `http://localhost:8000` (dokumentasi API: `http://localhost:8000/docs`).

### 2. Frontend

Buka terminal baru:

```bash
cd src/frontend
npm install
npm run dev
```

Buka `http://localhost:5173` di browser. Jika backend berjalan di alamat lain, atur variabel lingkungan `VITE_API_BASE_URL`.

## Pembagian Tugas

| Nama | NIM | Tugas |
|---|---|---|
| Mikhael Benrael Tampubolon | 13524009 | Simulated Annealing, Bonus Objective, Laporan, Backend |
| Marcel Luther Sitorus | 13524063 | Hill-Climbing, Visualisasi, Frontend |
| Richard Samuel Simanullang | 13524112 | Genetic Algorithm, Bonus Varian Hill-Climbing, Backend |
