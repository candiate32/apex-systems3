# Backend Integration Guide

This frontend is now fully integrated with the FastAPI backend at `http://localhost:8000`.

## Environment Configuration

The backend URL is configured via environment variables. By default, the app will use `http://localhost:8000` if no URL is specified.

**Important**: The `.env` file is auto-generated and managed by the system. To change the backend URL for development:

1. Create a `.env.local` file in the project root (this file is gitignored)
2. Add: `VITE_BACKEND_URL=http://localhost:8000` (or your backend URL)

## API Endpoints

All frontend API calls now route to the following FastAPI endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Clubs
- `GET /api/clubs` - List all clubs
- `POST /api/clubs` - Create club
- `GET /api/clubs/{id}` - Get club by ID
- `PUT /api/clubs/{id}` - Update club
- `DELETE /api/clubs/{id}` - Delete club
- `GET /api/clubs/search?q={query}` - Search clubs

### Players
- `GET /api/players` - List all players
- `POST /api/players` - Register player
- `GET /api/players/{id}` - Get player by ID
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player
- `GET /api/players/club/{club_id}` - Get players by club

### Courts
- `GET /api/courts` - List all courts
- `POST /api/courts` - Create court
- `GET /api/courts/active` - Get active courts
- `GET /api/courts/{id}` - Get court by ID
- `PUT /api/courts/{id}` - Update court
- `DELETE /api/courts/{id}` - Delete court

### Tournaments
- `GET /api/tournaments` - List tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/{id}` - Get tournament by ID
- `PUT /api/tournaments/{id}` - Update tournament
- `DELETE /api/tournaments/{id}` - Delete tournament
- `POST /api/tournaments/generate-fixtures` - Generate fixtures

### Matches
- `GET /api/matches` - List all matches
- `GET /api/matches/{id}` - Get match by ID
- `GET /api/matches/tournament/{tournament_id}` - Get matches by tournament
- `PUT /api/matches/{id}/score` - Update match score
- `PUT /api/matches/{id}/status` - Update match status
- `PUT /api/matches/{id}/court` - Assign court to match

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event
- `GET /api/events/{id}` - Get event by ID
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Registrations
- `GET /api/registrations` - List all registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations/event/{event_id}` - Get registrations by event
- `PUT /api/registrations/{id}` - Update registration status
- `DELETE /api/registrations/{id}` - Delete registration

### Algorithms
- `POST /api/algorithms/pairing` - Generate pairings
- `POST /api/algorithms/grouping` - Generate groups
- `POST /api/algorithms/knockout` - Generate knockout bracket
- `POST /api/algorithms/round-robin` - Generate round-robin schedule
- `POST /api/algorithms/scheduling` - Generate match schedule
- `POST /api/algorithms/match-code` - Generate match code
- `POST /api/algorithms/validate-match-code` - Validate match code

### CSV Operations
- `POST /api/csv/register-players` - Bulk register players via CSV
- `POST /api/csv/validate` - Validate CSV file
- `GET /api/csv/upload-template` - Download CSV template
- `GET /api/csv/registration-status/{club_id}` - Get registration status

### Statistics
- `GET /api/statistics` - Get dashboard statistics

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/court/{court_id}?date={date}` - Get court bookings
- `GET /api/bookings/user` - Get user bookings
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `GET /api/bookings/availability` - Check availability

## Authentication

The frontend uses JWT tokens stored in `localStorage`:
- User token: `token` key
- Admin token: `admin_token` key

All authenticated requests include the `Authorization: Bearer {token}` header.

## API Client

The main API client is in `src/api/base.ts` and provides:
- Automatic token injection for authenticated requests
- Error handling with toast notifications
- Type-safe request/response handling

## Usage in Components

```typescript
import { playerApi, clubApi, algorithmsApi } from "@/api";

// List players
const players = await playerApi.getPlayers();

// Create club
const club = await clubApi.createClub({
  name: "My Club",
  location: "City",
  about: "Description",
  contact: "email@example.com",
  courts: []
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

## Running the Stack

1. **Start the FastAPI backend**:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Start the frontend**:
   ```bash
   npm install
   npm run dev
   ```

The frontend will run on `http://localhost:8080` and proxy API requests to `http://localhost:8000`.

## Vite Proxy Configuration

For development, you may want to configure Vite to proxy `/api` requests to the backend. Add to `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
```

## Type Safety

All API endpoints are fully typed using TypeScript interfaces defined in:
- `src/api/authApi.ts` - Authentication types
- `src/api/playerApi.ts` - Player types
- `src/api/clubApi.ts` - Club types
- `src/api/courtApi.ts` - Court types
- `src/api/tournamentApi.ts` - Tournament and match types
- `src/api/algorithmsApi.ts` - Algorithm types
- `src/api/eventsApi.ts` - Event types
- `src/api/registrationsApi.ts` - Registration types
- `src/api/csvApi.ts` - CSV operation types
- `src/api/statisticsApi.ts` - Statistics types

## Error Handling

Errors are automatically displayed as toast notifications via `sonner`. All API errors include:
- Error message from backend
- HTTP status code
- User-friendly error description

## Next Steps

1. Ensure your FastAPI backend is running and accessible
2. Verify all endpoints match the schema defined above
3. Test authentication flow (register → login → authenticated requests)
4. Test key workflows:
   - Create club → Add courts
   - Register players → Create tournament
   - Generate fixtures → Schedule matches
   - Upload CSV → Bulk register players
