# React + TypeScript + Node.js + MongoDB starter

Пустой стартовый проект с разделением на:
- `client` — React + TypeScript (Vite)
- `server` — Node.js + TypeScript + Express + MongoDB (Mongoose)

## Требования
Ниже шаги установки, если на компьютере ничего не настроено.

### 1) Установка Node.js и npm
1. Скачайте LTS-версию Node.js (20+) с официального сайта: https://nodejs.org/
2. Установите, оставив опцию "Add to PATH" включенной.
3. Проверьте установку:
```powershell
node -v
npm -v
```

### 2) Установка MongoDB
Выберите один из вариантов:

**Вариант A: Локальная MongoDB (рекомендуется для разработки)**
1. Скачайте MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Установите, включив опцию установки как сервиса (Service).
3. Проверьте, что сервис запущен:
```powershell
Get-Service MongoDB
Start-Service MongoDB
```
4. Проверьте доступность порта:
```powershell
Test-NetConnection 127.0.0.1 -Port 27017
```

## Локальный запуск

### 1) Frontend
```powershell
cd client
npm install
npm run dev
```
Frontend будет доступен на `http://localhost:5173`.

### 2) Backend
```powershell
cd server
npm install
copy .env.example .env
npm run dev
```
Backend будет доступен на `http://localhost:5000`.

Проверка API:
- `GET http://localhost:5000/api/health`

## Прод-сборка backend
```powershell
cd server
npm run build
npm start
```
