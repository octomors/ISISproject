# React + TypeScript + Node.js + MongoDB starter

Пустой стартовый проект с разделением на:
- `client` — React + TypeScript (Vite)
- `server` — Node.js + TypeScript + Express + MongoDB (Mongoose)

## Требования
- Node.js 20+
- npm 10+
- MongoDB (локально или удалённый инстанс)

## Локальный запуск

### 1) Frontend
```bash
cd /home/runner/work/ISISproject/ISISproject/client
npm install
npm run dev
```
Frontend будет доступен на `http://localhost:5173`.

### 2) Backend
```bash
cd /home/runner/work/ISISproject/ISISproject/server
npm install
cp .env.example .env
npm run dev
```
Backend будет доступен на `http://localhost:5000`.

Проверка API:
- `GET http://localhost:5000/api/health`

## Прод-сборка backend
```bash
cd /home/runner/work/ISISproject/ISISproject/server
npm run build
npm start
```
