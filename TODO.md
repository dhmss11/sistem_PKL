# TODO: Fix Authentication Issue - Change 'username' to 'name'

## Backend Changes
- [x] Update be-express/src/models/userModel.js: Change all 'username' references to 'name' in queries and functions
- [x] Update be-express/src/controllers/authController.js: Change all 'username' to 'name' in destructuring, validation, insertion, responses
- [x] Update frontend/app/api/auth/verify/route.js: Change decoded.username to decoded.name and return name (with fallback for old tokens)

## Frontend Changes
- [x] Update frontend/app/(auth)/context/authContext.js: Change setName(data.nama) to setName(data.user) in checkAuth and login
- [x] Update any other files using 'username' to 'name' if needed (e.g., middleware, profile routes)

## Testing
- [x] Restart backend server
- [x] Clear browser cache/cookies
- [x] Test login and verify dashboard loads with user name
