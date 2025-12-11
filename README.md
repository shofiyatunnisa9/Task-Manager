## 📚 Mini Task Manager

Full-stack task manager composed of a NestJS backend and a Next.js frontend. The backend exposes JWT-protected CRUD APIs for tasks, while the frontend provides authentication, task listing, creation, editing, and deletion using React Query.

### 🚀Repository Layout

- `Backend/` — NestJS API with Prisma and PostgreSQL, JWT auth, and task endpoints.
- `frontend/` — Next.js app with React Query, React Hook Form, and Tailwind CSS.

### 📌 Backend Setup (`Backend/`)

1. Install dependencies: `npm install`
2. Create `.env` with values similar to:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
   JWT_SECRET="replace-this-secret"
   PORT=3001
   ALLOWED_ORIGINS=http://localhost:3000
   ```
3. Apply Prisma migrations and generate client:
   ```
   npx prisma migrate dev
   npx prisma generate
   ```
4. Run the API:

   `npm run start:dev`

Key endpoints:

- `POST /auth/register`, `POST /auth/login`
- `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` (JWT required)

### ✨ Frontend Setup (`frontend/`)

1. Install dependencies: `npm install`
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Run the app:
   `npm run dev`
