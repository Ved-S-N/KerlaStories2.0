# TODO: Implement User Authentication with Prisma and Azure SQL

## Backend Tasks

- [x] Update backend/routes/users.js:
  - Add POST /signup route: validate input, hash password with bcrypt, save to Prisma User table, handle errors.
  - Add POST /signin route: validate email/password, generate JWT, return token and user info.
- [x] Ensure backend has bcrypt and jsonwebtoken dependencies installed.
- [x] Verify Prisma client is initialized in server.js.

## Frontend Tasks

- [x] Update frontend/src/lib/auth.ts:
  - Replace mock signUp with API call to /signup.
  - Replace mock signIn with API call to /signin, store JWT token.
- [x] Update frontend/src/pages/SignUp.tsx:
  - On success, redirect to /dashboard.
- [x] Update frontend/src/pages/SignIn.tsx:
  - On success, redirect to /dashboard.

## Testing

- [ ] Test signup flow: create user, store in DB, redirect to dashboard.
- [ ] Test signin flow: validate credentials, login, redirect to dashboard.
- [ ] Handle errors: duplicate email, wrong password, missing fields.
