# Backend API Integration Guide

## Overview

This application uses **Supabase** for most data operations, but requires a **FastAPI backend** for complex tournament algorithm generation (pairing, scheduling, bracket generation).

---

## When is the Backend Required?

The backend is **only required** for:

✅ **Tournament Algorithm Generation**
- Player pairing algorithms
- Group division
- Knockout bracket generation
- Round-robin scheduling
- Match scheduling optimization
- Match code generation/validation

❌ **NOT required** for:
- User authentication (uses Supabase Auth)
- CRUD operations (players, clubs, courts, tournaments, matches)
- Court bookings
- Event registrations
- Statistics and reporting

---

## Backend Setup

### Prerequisites

- Python 3.8+
- FastAPI backend repository (separate from this frontend)

### Environment Configuration

Add to `.env`:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:8000

# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Running the Backend Locally

```bash
# Clone backend repository
git clone <your-backend-repo-url>
cd apex-match-system-backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

The backend should be accessible at `http://localhost:8000`

---

## API Endpoints

### Algorithm Endpoints

All endpoints require authentication via JWT token in `Authorization: Bearer <token>` header.

#### 1. **Pairing Algorithm**
```http
POST /api/algorithms/pairing
Content-Type: application/json
Authorization: Bearer <token>

{
  "players": [
    {"id": "player1", "name": "John Doe", "rating": 1500},
    {"id": "player2", "name": "Jane Smith", "rating": 1600}
  ],
  "rounds": 5
}
```

**Response**:
```json
{
  "pairings": [
    {
      "round": 1,
      "matches": [
        {"player1": "player1", "player2": "player2"}
      ]
    }
  ]
}
```

---

#### 2. **Grouping Algorithm**
```http
POST /api/algorithms/grouping
Content-Type: application/json
Authorization: Bearer <token>

{
  "players": ["player1", "player2", "player3", "player4"],
  "groups_count": 2,
  "seeding": [1, 2, 3, 4]
}
```

**Response**:
```json
{
  "groups": [
    {"group_id": 1, "players": ["player1", "player3"]},
    {"group_id": 2, "players": ["player2", "player4"]}
  ]
}
```

---

#### 3. **Knockout Bracket**
```http
POST /api/algorithms/knockout
Content-Type: application/json
Authorization: Bearer <token>

{
  "players": ["player1", "player2", "player3", "player4"],
  "seeding": [1, 2, 3, 4]
}
```

**Response**:
```json
{
  "rounds": [
    {
      "round": 1,
      "matches": [
        {"match_id": "m1", "player1": "player1", "player2": "player4"},
        {"match_id": "m2", "player1": "player2", "player2": "player3"}
      ]
    }
  ]
}
```

---

#### 4. **Round-Robin Schedule**
```http
POST /api/algorithms/round-robin
Content-Type: application/json
Authorization: Bearer <token>

{
  "players": ["player1", "player2", "player3", "player4"]
}
```

**Response**:
```json
{
  "rounds": [
    {
      "round": 1,
      "matches": [
        {"player1": "player1", "player2": "player2"},
        {"player1": "player3", "player2": "player4"}
      ]
    }
  ]
}
```

---

#### 5. **Match Scheduling**
```http
POST /api/algorithms/scheduling
Content-Type: application/json
Authorization: Bearer <token>

{
  "matches": [
    {"id": "m1", "player1": "p1", "player2": "p2", "duration": 30}
  ],
  "courts": [
    {"id": "c1", "name": "Court 1"}
  ],
  "match_duration": 30,
  "rest_time": 10,
  "start_time": "09:00"
}
```

**Response**:
```json
{
  "scheduled_matches": [
    {
      "match_id": "m1",
      "court": {"id": "c1", "name": "Court 1"},
      "start_time": "09:00",
      "end_time": "09:30",
      "player1": {"id": "p1", "name": "Player 1"},
      "player2": {"id": "p2", "name": "Player 2"}
    }
  ],
  "total_schedule_time": 30,
  "court_utilization": {"c1": 100},
  "player_rest_violations": [],
  "scheduling_conflicts": []
}
```

---

#### 6. **Match Code Generation**
```http
POST /api/algorithms/match-code
Content-Type: application/json
Authorization: Bearer <token>

{
  "match_id": "match123"
}
```

**Response**:
```json
{
  "match_id": "match123",
  "match_code": "ABC123",
  "expires_at": "2024-12-31T23:59:59Z"
}
```

---

#### 7. **Match Code Validation**
```http
POST /api/algorithms/validate-match-code
Content-Type: application/json
Authorization: Bearer <token>

{
  "match_code": "ABC123"
}
```

**Response**:
```json
{
  "valid": true,
  "match_id": "match123",
  "message": "Match code is valid"
}
```

---

## Frontend Integration

### Using the API

The frontend uses `algorithmsApi` from `src/api/algorithmsApi.ts`:

```typescript
import { algorithmsApi } from '@/api/algorithmsApi';

// Generate knockout bracket
const bracket = await algorithmsApi.knockout({
  players: ['player1', 'player2', 'player3', 'player4'],
  seeding: [1, 2, 3, 4]
});

// Generate schedule
const schedule = await algorithmsApi.scheduling({
  matches: [...],
  courts: [...],
  match_duration: 30,
  rest_time: 10,
  start_time: "09:00"
});
```

### Authentication

The API automatically includes the JWT token from `localStorage`:

```typescript
// Token is set during login
localStorage.setItem('token', authToken);

// API requests automatically include: Authorization: Bearer <token>
```

---

## Troubleshooting

### Backend Not Running
**Error**: `API Error: Failed to fetch`

**Solution**: Ensure FastAPI backend is running on `http://localhost:8000`

### Authentication Errors
**Error**: `401 Unauthorized`

**Solution**: 
1. Verify user is logged in
2. Check token exists: `localStorage.getItem('token')`
3. Token may have expired - re-login

### CORS Errors
**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: Configure CORS in FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Development Without Backend

Most features work without the backend running. You can:

✅ Browse tournaments, players, clubs
✅ Create/edit players, clubs, courts
✅ Book courts
✅ Register for events
✅ View statistics

❌ Cannot:
- Generate tournament fixtures
- Auto-schedule matches
- Generate knockout brackets
- Create round-robin schedules

---

## Production Deployment

### Backend Deployment

Deploy FastAPI backend to:
- **Heroku**: `heroku create && git push heroku main`
- **Railway**: Connect GitHub repo
- **AWS Lambda**: Use Mangum adapter
- **Google Cloud Run**: Containerize with Docker

### Update Environment Variable

```env
# Production backend URL
VITE_BACKEND_URL=https://your-backend.herokuapp.com
```

---

## API Module Reference

| Module | Purpose | Backend Required |
|--------|---------|------------------|
| `authApi` | User authentication | ❌ (Supabase) |
| `playerApi` | Player CRUD | ❌ (Supabase) |
| `clubApi` | Club management | ❌ (Supabase) |
| `courtApi` | Court management | ❌ (Supabase) |
| `bookingApi` | Court bookings | ❌ (Supabase) |
| `tournamentApi` | Tournament CRUD | ❌ (Supabase) |
| `eventsApi` | Event management | ❌ (Supabase) |
| `registrationsApi` | Event registrations | ❌ (Supabase) |
| `statisticsApi` | Statistics | ❌ (Supabase) |
| `csvApi` | CSV parsing | ❌ (Client-side) |
| **`algorithmsApi`** | **Tournament algorithms** | **✅ Required** |

---

## Summary

- **90% of features** work with Supabase only
- **Backend required** only for tournament algorithm generation
- Easy to run locally for development
- Can be deployed separately for production
