# DeskFlow — Support Ticket Triage Board

A full-stack MERN application for managing support tickets with a Kanban-style board, SLA tracking, priority-based triage, and drag-and-drop functionality.

## Tech Stack

- **Frontend:** React 19, Vite, @hello-pangea/dnd, Axios
- **Backend:** Node.js, Express 4, Mongoose 8
- **Database:** MongoDB (Atlas free tier)

## Features

- 📋 Kanban board with 4 status columns (Open, In Progress, Resolved, Closed)
- 🎯 Priority-based SLA tracking with breach indicators
- 🖱️ Drag-and-drop ticket movement with transition rule enforcement
- 📊 Real-time stats strip (counts per status + SLA breaches)
- 🔍 Filters by priority and SLA breach status
- ✅ Server-side input validation with detailed error responses
- 🎨 Dark theme with glassmorphism, smooth animations, and responsive layout

## Project Structure

```
deskflow/
├── backend/          # Express API server
│   ├── config/       # Database connection
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routes
│   ├── utils/        # SLA + transition logic
│   └── validators/   # Input validation rules
│
└── frontend/         # React SPA (Vite)
    └── src/
        ├── api/          # Axios API wrappers
        ├── components/   # UI components
        ├── hooks/        # Custom React hooks
        └── utils/        # Formatting helpers
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/tickets` requests to `http://localhost:5000`.

## Environment Variables

### Backend (.env)

| Variable      | Description                          | Default               |
|---------------|--------------------------------------|-----------------------|
| `MONGO_URI`   | MongoDB connection string            | (required)            |
| `PORT`        | Server port                          | 5000                  |
| `CORS_ORIGIN` | Allowed CORS origin                  | `http://localhost:5173`|

### Frontend (.env)

| Variable       | Description                          | Default |
|----------------|--------------------------------------|---------|
| `VITE_API_URL` | Backend API base URL (production)    | (empty — uses proxy)  |

## API Endpoints

| Method   | Endpoint         | Description                           |
|----------|------------------|---------------------------------------|
| `POST`   | `/tickets`       | Create a ticket                       |
| `GET`    | `/tickets`       | List tickets (supports filters)       |
| `PATCH`  | `/tickets/:id`   | Update ticket (status transitions)    |
| `DELETE` | `/tickets/:id`   | Delete a ticket                       |
| `GET`    | `/tickets/stats` | Aggregate counts and breach stats     |

### Query Filters (GET /tickets)

- `?status=open` — Filter by status
- `?priority=high` — Filter by priority
- `?breached=true` — Show only SLA-breached tickets
- Filters are combinable: `?priority=high&breached=true`

## Status Transition Rules

- **Forward:** open → in_progress → resolved → closed
- **Backward:** Only one step back is allowed
- Moving to `resolved` auto-sets `resolvedAt`
- Moving away from `resolved` clears `resolvedAt`
- Invalid transitions return 400 with a descriptive error

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repo, set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `CORS_ORIGIN`

### Frontend (Netlify)

1. Connect your GitHub repo
2. Base directory: `frontend/`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
