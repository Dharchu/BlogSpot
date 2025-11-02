# Backend - BlogSpot

## Setup
1. cd backend
2. npm install
3. Edit .env if needed (file already contains the provided MongoDB & Cloudinary credentials)
4. Seed sample data & create admin:
   node scripts/create_admin.js
5. Run server:
   npm run dev

APIs:
- POST /api/auth/register
- POST /api/auth/login
- GET/POST /api/posts
- GET /api/posts/:id
- PUT/DELETE /api/posts/:id
- POST /api/posts/:id/like
- POST /api/posts/:id/comment
- GET /api/users/me
- PUT /api/users/me
- Admin: GET/DELETE /api/admin/users, GET/DELETE /api/admin/posts
