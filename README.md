# ISISproject

Веб-платформа коллективной оптимизации кода (React + TypeScript + Node.js + MongoDB).

Реализовано по `TechnicalSpecification.md` для роли **User**:
- регистрация и логин,
- публикация задач с платным списанием баллов,
- отправка решений в чужие задачи,
- голосование за чужие решения,
- автоматическое завершение задач по дедлайну,
- начисление награды победителю,
- лидерборд по баллам.

## Требования
- Node.js 20+
- npm
- MongoDB (локально или удалённо)

## Структура
- `client` — React + Vite
- `server` — Express + TypeScript + MongoDB
  - `src/routes` — API роуты
  - `src/services` — прикладная бизнес-логика
  - `src/models` — схемы и модели MongoDB
  - `src/middleware` — middleware авторизации и rate-limit

Папка с low-fidelity прототипом UI удалена из репозитория, так как её содержимое уже интегрировано в основной клиент.

## 1) Запуск backend

```bash
cd server
npm install
cp .env.example .env
```

Заполни `.env` (минимум `MONGODB_URI` и `JWT_SECRET`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/isisproject
JWT_SECRET=change_me_to_long_random_secret
PUBLISH_COST=10
PLATFORM_REWARD=50
INITIAL_POINTS=100
```

Запуск dev-сервера:

```bash
npm run dev
```

Проверка:
- `GET http://localhost:5000/api/health`

## 2) Запуск frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend откроется на `http://localhost:5173`.

Если backend не на `http://localhost:5000`, укажи в `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## 3) Что проверить вручную
1. Зарегистрироваться в UI.
2. Залогиниться.
3. Опубликовать задачу (должны списаться `PUBLISH_COST` баллов).
4. Под другим пользователем отправить решение в эту задачу.
5. Под третьим пользователем проголосовать за чужое решение.
6. Дождаться дедлайна (или нажать «Закрыть просроченные задачи»), проверить начисление `PLATFORM_REWARD` победителю.
7. Проверить лидерборд.

## Полезные API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- `GET /api/platform-config`
- `POST /api/tasks`
- `GET /api/tasks`
- `POST /api/tasks/:taskId/submissions`
- `POST /api/tasks/:taskId/votes`
- `POST /api/tasks/finalize-expired`
- `GET /api/leaderboard`
