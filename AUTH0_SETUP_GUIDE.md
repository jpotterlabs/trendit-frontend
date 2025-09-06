# Auth0 Integration Setup Guide

This guide explains how to set up Auth0 OAuth authentication for the Trendit frontend when deployed standalone.

## Prerequisites

1. **Auth0 Account**: You need an Auth0 account and application configured
2. **Backend API**: The Trendit FastAPI backend must be running with Auth0 integration
3. **Social OAuth Apps**: Google and/or GitHub OAuth applications configured

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the frontend root with these variables:

```bash
# Auth0 Configuration (Required for OAuth)
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://your-api-audience
NEXT_PUBLIC_AUTH0_BASE_URL=https://your-frontend-domain.com

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_AUTH0_DOMAIN` | Your Auth0 tenant domain | `dev-abc123.us.auth0.com` |
| `NEXT_PUBLIC_AUTH0_CLIENT_ID` | Auth0 application client ID | `ABC123xyz...` |
| `NEXT_PUBLIC_AUTH0_AUDIENCE` | API audience identifier | `https://trendit-api.com` |
| `NEXT_PUBLIC_AUTH0_BASE_URL` | Your frontend URL | `https://trendit.example.com` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.trendit.com` |

## Auth0 Dashboard Configuration

### 1. Application Settings

In your Auth0 Dashboard → Applications → [Your App]:

**Allowed Callback URLs:**
```
http://localhost:3000/auth/callback,
https://your-domain.com/auth/callback
```

**Allowed Web Origins:**
```
http://localhost:3000,
https://your-domain.com
```

**Allowed Logout URLs:**
```
http://localhost:3000,
https://your-domain.com
```

### 2. Social Connections

#### Enable Google OAuth:
1. Go to Authentication → Social
2. Enable Google connection
3. Configure with your Google OAuth credentials:
   - Client ID from Google Cloud Console
   - Client Secret from Google Cloud Console

#### Enable GitHub OAuth:
1. In Authentication → Social
2. Enable GitHub connection  
3. Configure with your GitHub OAuth app credentials:
   - Client ID from GitHub Developer Settings
   - Client Secret from GitHub Developer Settings

### 3. API Configuration

In Auth0 Dashboard → APIs:

1. Create or configure your API
2. Set **Identifier** to match `NEXT_PUBLIC_AUTH0_AUDIENCE`
3. Enable **Allow Skipping User Consent**

## Backend Integration

### Required Backend Endpoints

Your backend must implement these Auth0 endpoints:

```python
# Health check
GET /auth0/health

# OAuth callback handler  
POST /auth0/callback
{
  "access_token": "auth0_access_token"
}

# Response:
{
  "message": "Login successful",
  "user": {...},
  "jwt_token": "backend_jwt_token",
  "api_key": "backend_api_key"
}
```

### Database Schema

Backend must support these user fields:

```sql
-- Auth0 integration fields
auth0_user_id VARCHAR NULL UNIQUE,  -- Auth0 sub claim
auth0_provider VARCHAR NULL,        -- 'google', 'github', 'auth0'
password_hash VARCHAR NULL          -- Nullable for OAuth users
```

## OAuth Flow

1. **User clicks OAuth button** → Frontend redirects to Auth0
2. **Auth0 handles OAuth** → User authenticates with Google/GitHub  
3. **Auth0 redirects back** → `/auth/callback` with authorization code
4. **Frontend gets access token** → Calls Auth0 for access token
5. **Backend integration** → POST `/auth0/callback` with access token
6. **User creation/login** → Backend creates user, returns JWT + API key
7. **Frontend state** → User logged in, redirected to dashboard

## Graceful Degradation

The Auth0 integration includes graceful fallbacks:

- **Missing config**: OAuth buttons won't render, email/password still works
- **Auth0 unavailable**: Users can still use traditional login
- **Backend errors**: Clear error messages displayed to users

## Development vs Production

### Development (localhost:3000):
```bash
NEXT_PUBLIC_AUTH0_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production:
```bash
NEXT_PUBLIC_AUTH0_BASE_URL=https://trendit.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Troubleshooting

### Common Issues:

1. **"Auth0 configuration missing"**
   - Check environment variables are set correctly
   - Ensure variables start with `NEXT_PUBLIC_`

2. **OAuth redirect errors**
   - Verify callback URLs in Auth0 dashboard
   - Check `NEXT_PUBLIC_AUTH0_BASE_URL` matches your domain

3. **Backend callback failures**
   - Ensure `/auth0/callback` endpoint is implemented
   - Check API URL configuration
   - Verify CORS settings allow your frontend domain

4. **Social login not available**
   - Enable Google/GitHub connections in Auth0
   - Configure OAuth app credentials
   - Check connection names ('google-oauth2', 'github')

## Testing

### Local Testing:
1. Start backend: `uvicorn main:app --reload --port 8000`
2. Start frontend: `npm run dev`
3. Visit: `http://localhost:3000/auth/login`
4. Test OAuth buttons

### Production Testing:
1. Deploy backend with Auth0 environment variables
2. Deploy frontend with production environment variables
3. Update Auth0 dashboard with production URLs
4. Test complete OAuth flow

## Security Notes

- **Client Secret**: Only needed in backend, never expose in frontend
- **Audience**: Should match between frontend and backend
- **Redirect URIs**: Must exactly match configured URLs
- **HTTPS**: Required in production for secure OAuth flows