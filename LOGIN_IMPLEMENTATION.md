# Login System Documentation

## Overview
The login system in TaraAdmin allows users to authenticate using either email or username, validates user type (prevents "traveler" type from accessing admin), and manages session state.

## Flow

### 1. User Submits Credentials
User enters email/username and password in the Login screen (`src/pages/auth/Login.tsx`)

### 2. Frontend Process
1. `handleSubmit()` calls `loginUser()` from authService
2. authService sends POST request to backend: `POST /api/auth/login`
3. Backend validates credentials and returns user data + tokens
4. Frontend checks if `user.type === 'traveler'`
   - If traveler: Show error, don't save session
   - If not traveler: Save to SessionContext and redirect to dashboard

### 3. Session Management
User data and tokens are stored in:
- SessionContext (React state)
- localStorage (for persistence)

## Files Involved

### Frontend
- **src/pages/auth/Login.tsx** - Login UI and form handling
- **src/services/authService.ts** - API communication
- **src/context/SessionContext.tsx** - Session state management
- **src/constants/Config.ts** - Backend URL configuration

### Backend
- **src/routes/auth.ts** - Auth endpoints
- **src/controllers/authController.ts** - Login logic
- **src/services/authService.ts** - Password hashing, DB queries

## Login Endpoint

### Request
```
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "email@example.com or username",
  "password": "password123"
}
```

### Response (Success)
```json
{
  "user": {
    "_id": "user_id",
    "fname": "John",
    "lname": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "type": "admin",
    "contactNumber": "+1234567890",
    "bdate": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "profileImages": [],
    "bio": "",
    "status": "active",
    "createdOn": "2023-01-01T00:00:00.000Z",
    "updatedOn": "2023-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response (Failure)
```json
{
  "error": "Invalid email/username or password"
}
```

## Frontend Implementation

### authService.ts
```typescript
// Login function
loginUser(identifier: string, password: string): Promise<LoginResponse>
  - Takes email or username and password
  - Sends to BACKEND_URL/api/auth/login
  - Returns user data and tokens
  - Throws error on failure

// Token management
setAuthTokens(accessToken: string, refreshToken: string): void
  - Stores tokens in localStorage

getStoredToken(): string | null
  - Retrieves token from localStorage
```

### Login.tsx Flow
```typescript
1. User enters identifier (email/username) and password
2. Click submit button or press Enter
3. handleSubmit() called
4. Call loginUser(identifier, password)
5. Check response.user.type
   - If 'traveler': Show error "Access denied"
   - Otherwise: updateSession() with user data
6. Navigate to dashboard (/)
```

### SessionContext Integration
```typescript
await updateSession({
  user: {
    id: response.user._id,
    fname: response.user.fname,
    lname: response.user.lname,
    username: response.user.username,
    email: response.user.email,
    bdate: new Date(response.user.bdate),
    gender: response.user.gender,
    contactNumber: response.user.contactNumber,
    profileImage: response.user.profileImages?.[0] || "",
    status: response.user.status,
    type: response.user.type,
    createdOn: new Date(response.user.createdOn),
  },
  accessToken: response.accessToken,
  refreshToken: response.refreshToken,
});
```

## User Types

### Allowed Types (Can Access Admin)
- `admin` - Full admin access
- `moderator` - Moderation capabilities
- Any type except `traveler`

### Denied Types (Cannot Access Admin)
- `traveler` - Only has access to the TaraG mobile app

## Error Handling

### Common Errors

**Invalid Credentials**
```
Error: "Invalid email/username or password"
Status: 401
```

**Traveler Account**
```
Error: "Access denied. Traveler accounts cannot access the admin panel."
Status: 403 (custom frontend validation)
```

**Network Error**
```
Error: "An unexpected error occurred during login"
```

### User Feedback
- Error messages displayed in red banner below password field
- Loading spinner shown during submission
- Button disabled while loading
- Submit button disabled if fields are empty

## Security Considerations

### Frontend
✅ Tokens stored in localStorage with keys: `token`, `refreshToken`
✅ Type validation prevents traveler access
✅ Passwords never logged or transmitted in plain text (HTTPS only)

### Backend
✅ Password hashed with bcrypt
✅ JWT tokens generated with expiration
✅ Email/username case-insensitive lookup
✅ Rate limiting recommended (not yet implemented)

### Improvements Needed
⚠️ Consider HTTPOnly cookies instead of localStorage
⚠️ Add CSRF protection
⚠️ Implement rate limiting
⚠️ Add login attempt logging
⚠️ Implement token refresh mechanism

## Testing Checklist

### Manual Testing
- [ ] Login with valid email
- [ ] Login with valid username
- [ ] Login with invalid email/password
- [ ] Login with traveler account (should fail)
- [ ] Login with admin account (should succeed)
- [ ] Press Enter to submit form
- [ ] Check tokens are saved in localStorage
- [ ] Check user data in SessionContext
- [ ] Check browser reloads and session persists
- [ ] Test on light/dark theme

### Test Credentials (Backend Required)
```
Admin Account:
Email: admin@example.com
Username: admin
Password: password123
Type: admin

Traveler Account:
Email: traveler@example.com
Username: traveler_user
Password: password123
Type: traveler
```

## Configuration

### BACKEND_URL
Located in `src/constants/Config.ts`:
```typescript
export const BACKEND_URL = "http://192.168.68.109:5000";
```

Update this to match your backend server address:
- Development: `http://localhost:5000`
- Production: Your production backend URL

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| POST | /api/auth/send-verification | Send verification code |
| POST | /api/auth/verify-email | Verify email with code |
| POST | /api/auth/reset-password | Reset password |
| POST | /api/auth/change-password | Change password (authenticated) |

## Session Persistence

### On Page Reload
1. SessionContext loads session from localStorage
2. User data and tokens restored
3. User stays logged in if session exists
4. App.tsx ProtectedOutlet checks for session.user

### On Logout
1. clearSession() called
2. localStorage cleared
3. User redirected to login

## Next Steps

1. **Set correct BACKEND_URL** in `src/constants/Config.ts`
2. **Ensure backend is running** on configured URL
3. **Test login** with valid credentials
4. **Implement token refresh** logic if access token expires
5. **Add password reset** flow (partially ready)
6. **Add user registration** flow (backend ready)

## Troubleshooting

### "Login failed" Error
- Check BACKEND_URL is correct
- Verify backend server is running
- Check network tab in browser DevTools
- Verify request body contains identifier and password

### Traveler Account Still Logged In
- Check response.user.type is "traveler"
- Verify error message is displayed
- Check SessionContext is not updated

### Tokens Not Saving
- Check localStorage has not been cleared
- Verify setAuthTokens() is called
- Check browser storage settings

### Session Lost on Reload
- Ensure SessionContext loads from localStorage
- Check localStorage.getItem("session") returns valid JSON
- Verify User dates are being converted properly

## Code Example: Using Logged-In User

```tsx
import { useSession } from '@/context/SessionContext';

function UserProfile() {
  const { session } = useSession();
  
  return (
    <div>
      <h1>Welcome, {session?.user?.fname}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Type: {session?.user?.type}</p>
    </div>
  );
}
```

## Frontend to Backend Communication

### Request Flow
```
Login.tsx
  ↓ (calls)
authService.loginUser()
  ↓ (fetch POST)
BACKEND_URL/api/auth/login
  ↓ (processed by)
authController.login()
  ↓ (calls)
authService.loginUser()
  ↓ (queries)
User.findOne() or User.findById()
  ↓ (bcrypt compare)
password validation
  ↓ (jwt.sign)
generates accessToken & refreshToken
  ↓ (returns)
LoginResponse { user, accessToken, refreshToken }
```

### Response Flow
```
Backend returns LoginResponse
  ↓
Frontend receives in handleSubmit()
  ↓
Check user.type !== 'traveler'
  ↓
updateSession() stores in SessionContext & localStorage
  ↓
navigate('/') redirects to Dashboard
  ↓
App.tsx ProtectedOutlet renders Dashboard
```
