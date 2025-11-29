# DogAdoption API

Express + MongoDB API for registering and adopting dogs with JWT cookie auth.

## Prerequisites
- Node.js 22+
- MongoDB
- `.env` with:
  - DATABASE_URI=mongodb://...
  - JSON_WEB_TOKEN_SECRET=your_secret

## Project Structure
- src/app.js              # Express app + routes wiring
- src/routes/             # Auth and adoption routers
- src/controllers/        # Route handlers
- src/models/             # Mongoose models (User, Dog)
- src/middlewares/        # Auth middleware (JWT from cookie)
- tests/route.test.js     # Supertest + Vitest integration tests

## Auth
- Signup/Login set an HTTP-only `jwt` cookie.
- Protected routes use middleware that reads the JWT cookie.

## Routes (high level)
- POST /signup                       -> create user, sets jwt cookie
- POST /login                        -> login, sets jwt cookie
- POST /api/register                 -> register a dog (auth required)
- POST /api/adopt                    -> adopt a dog (auth required)
- DELETE /api/adopt                  -> remove a dog you registered (auth required)
- GET /api/dogs?isAdopted=&myDogs=&page=  -> list dogs with filters/pagination (auth required for myDogs)

## Notes
- `User` passwords are hashed via a pre-save hook.
- Dog creation returns `{ dogId }`; updates return messages.
- Tests use a persistent supertest agent to retain cookies across requests.
