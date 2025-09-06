# Auth0 Architecture & Portability Documentation

This document explains the complete Auth0 integration architecture, library dependencies, and portability strategy for the Trendit application.

## 🏗️ **System Architecture Overview**

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   Frontend      │ ◄──────────────► │    Backend       │
│   (Next.js)     │                 │   (FastAPI)      │
│                 │                 │                  │
│ @auth0/         │                 │ python-jose      │
│ auth0-react     │                 │ requests         │
└─────────────────┘                 └──────────────────┘
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌──────────────────┐
│     Auth0       │                 │   PostgreSQL     │
│   (OAuth SaaS)  │                 │   Database       │
│                 │                 │                  │
│ • Google OAuth  │                 │ • Users          │
│ • GitHub OAuth  │                 │ • Auth0 fields   │
│ • JWT tokens    │                 │ • Subscriptions  │
└─────────────────┘                 └──────────────────┘
```

## 📚 **Library Dependencies**

### **Backend Dependencies**
```python
# requirements.txt
python-jose[cryptography]==3.3.0  # JWT token verification from Auth0
requests==2.32.3                  # HTTP calls to Auth0 APIs for user info
```

**Backend Purpose:**
- Verify JWT tokens issued by Auth0
- Fetch user profile data from Auth0 APIs
- Create/update users in local database
- Issue own JWT tokens + API keys for app usage

### **Frontend Dependencies**  
```json
{
  "dependencies": {
    "@auth0/auth0-react": "^2.4.0"  // OAuth login flows, token management
  }
}
```

**Frontend Purpose:**
- Handle OAuth login redirects (Google, GitHub)
- Manage Auth0 user session state
- Get access tokens from Auth0
- Send tokens to backend for verification

### **❌ No Shared Libraries**

**Key Design Decision:** Zero shared code between frontend and backend.

**Why this approach:**
- ✅ **Independent deployments** - Each service can be updated separately
- ✅ **Technology flexibility** - Frontend uses React libs, backend uses Python libs
- ✅ **No version conflicts** - Each service manages its own dependencies
- ✅ **Simplified CI/CD** - No monorepo complexity
- ✅ **Team autonomy** - Frontend and backend teams can work independently

## 🔄 **OAuth Flow Architecture**

### **Complete Authentication Flow:**

```
1. User clicks "Login with Google"
   ↓
2. Frontend (@auth0/auth0-react) → Auth0 login page
   ↓
3. Auth0 → Google OAuth
   ↓
4. Google → User consents → Auth0
   ↓
5. Auth0 → Frontend (/auth/callback) with authorization code
   ↓
6. Frontend → Auth0 (exchange code for access token)
   ↓
7. Frontend → Backend POST /auth0/callback { access_token }
   ↓
8. Backend (python-jose) → Auth0 API (verify token + get user info)
   ↓
9. Backend → Database (create/update user with auth0_user_id)
   ↓
10. Backend → Frontend { jwt_token, api_key, user }
    ↓
11. Frontend stores tokens → Dashboard
```

### **Integration Endpoints**

**Only 2 HTTP endpoints connect frontend ↔ backend:**

```http
# Health check
GET /auth0/health
Response: { "status": "healthy", "jwks_keys": 2 }

# OAuth callback processing  
POST /auth0/callback
Request: { "access_token": "eyJ..." }
Response: { 
  "user": {...}, 
  "jwt_token": "trendit_jwt_token", 
  "api_key": "trendit_api_key" 
}
```

## 🚀 **Frontend Portability**

### **What "Portable" Means**

The frontend is **completely self-contained** and can be deployed independently of the backend location.

### **✅ Deployment Flexibility**

**Current Development Setup:**
```
/Trendit/
├── backend/          ← FastAPI server
└── frontend/         ← Next.js app
```

**Standalone Production Setup:**
```
api.trendit.com       ← Backend (any cloud provider)
app.trendit.com       ← Frontend (any hosting platform)
```

### **✅ Hosting Options**

The frontend can be deployed on any platform that supports Next.js:

| Platform | Configuration |
|----------|--------------|
| **Vercel** | Zero config, environment variables in dashboard |
| **Netlify** | `_redirects` file, environment variables in settings |
| **AWS S3 + CloudFront** | Static build output, environment at build time |
| **Docker** | Containerized with environment variables |
| **Traditional VPS** | PM2 or systemd service |
| **Corporate Infrastructure** | Internal servers with proxy configuration |

### **✅ Environment-Driven Configuration**

**All external dependencies configured via environment variables:**

```bash
# API Connection
NEXT_PUBLIC_API_URL=https://your-backend-anywhere.com

# Auth0 Configuration (Optional - graceful fallback)
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://trendit-api.com
NEXT_PUBLIC_AUTH0_BASE_URL=https://your-frontend-domain.com
```

**Key Portability Features:**
- 🔧 **No hardcoded URLs** - All endpoints configurable
- 🛡️ **Graceful degradation** - OAuth optional, email/password always works
- 🌐 **CORS independent** - Backend configures CORS for any frontend domain
- 📦 **Self-contained** - All dependencies in package.json

## 🗄️ **Database Integration**

### **Backend Database Schema**

```sql
-- Users table with Auth0 integration
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE,
  password_hash VARCHAR NULL,        -- Nullable for OAuth users
  
  -- Auth0 Integration Fields
  auth0_user_id VARCHAR UNIQUE NULL, -- Auth0 'sub' claim
  auth0_provider VARCHAR NULL,       -- 'google', 'github', 'auth0'
  
  -- App-specific fields
  subscription_status VARCHAR DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **User Creation Flow**

```python
# Backend creates users from Auth0 data
def get_or_create_user(auth0_claims):
    auth0_user_id = auth0_claims.get("sub")         # "google-oauth2|123456"
    email = auth0_claims.get("email")               # "user@gmail.com"
    provider = extract_provider(auth0_user_id)      # "google"
    
    # Check existing user by email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new OAuth user
        user = User(
            email=email,
            password_hash=None,           # No password for OAuth
            auth0_user_id=auth0_user_id,  # Link to Auth0
            auth0_provider=provider
        )
```

## 🔧 **Configuration Management**

### **Development vs Production**

**Development (localhost):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH0_BASE_URL=http://localhost:3000
```

**Staging:**
```bash
NEXT_PUBLIC_API_URL=https://staging-api.trendit.com
NEXT_PUBLIC_AUTH0_BASE_URL=https://staging.trendit.com
```

**Production:**
```bash
NEXT_PUBLIC_API_URL=https://api.trendit.com  
NEXT_PUBLIC_AUTH0_BASE_URL=https://trendit.com
```

### **Auth0 Dashboard Configuration**

**Application Settings must match environment:**

```javascript
// Development
Allowed Callback URLs: http://localhost:3000/auth/callback
Allowed Web Origins: http://localhost:3000

// Production  
Allowed Callback URLs: https://trendit.com/auth/callback
Allowed Web Origins: https://trendit.com
```

## 🛡️ **Security Architecture**

### **Token Flow Security**

```
┌─────────────┐   Access Token    ┌──────────┐
│  Frontend   │ ────────────────► │ Backend  │
│             │                   │          │
│ Never stores│                   │ Verifies │
│ sensitive   │ ◄──────────────── │ with     │
│ secrets     │   JWT + API Key   │ Auth0    │
└─────────────┘                   └──────────┘
```

**Security Boundaries:**
- 🔐 **Auth0 Client Secret** - Only in backend environment, never exposed
- 🎫 **Access Tokens** - Short-lived, verified by backend via Auth0 JWKS
- 🔑 **JWT Tokens** - App-specific tokens issued by backend
- 🗝️ **API Keys** - Long-lived tokens for API access

### **Environment Security**

**Frontend (Public):**
```bash
# These are safe to expose in browser
NEXT_PUBLIC_AUTH0_DOMAIN=public-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=public_client_id
```

**Backend (Private):**
```bash
# These stay server-side only
AUTH0_CLIENT_SECRET=super_secret_value
JWT_SECRET_KEY=backend_signing_key
```

## 📦 **Deployment Scenarios**

### **Scenario 1: Microservices**
```
Frontend:  Vercel (global CDN)
Backend:   AWS ECS (containers)  
Database:  RDS PostgreSQL
Auth0:     SaaS (auth0.com)
```

### **Scenario 2: Traditional Hosting**
```
Frontend:  Nginx static files
Backend:   Docker container on VPS
Database:  Self-hosted PostgreSQL
Auth0:     SaaS (auth0.com)
```

### **Scenario 3: Enterprise**
```
Frontend:  Corporate web servers
Backend:   On-premises Kubernetes
Database:  Enterprise PostgreSQL
Auth0:     Enterprise Auth0 tenant
```

## 🔄 **Integration Benefits**

### **For Development Teams**

**Frontend Team:**
- ✅ Can deploy and test independently
- ✅ Can mock backend API responses
- ✅ Full control over UI/UX flows
- ✅ No backend knowledge required for Auth0 integration

**Backend Team:**  
- ✅ Can test Auth0 integration with curl/Postman
- ✅ Database schema changes don't affect frontend
- ✅ Can deploy API updates independently
- ✅ Full control over user data and business logic

### **For DevOps/Deployment**

**Advantages:**
- 🚀 **Independent scaling** - Scale frontend and backend separately
- 🔄 **Independent releases** - Deploy frontend or backend without affecting the other
- 🌍 **Geographic distribution** - Frontend on CDN, backend in optimal regions
- 💰 **Cost optimization** - Use different hosting strategies for each service
- 🛠️ **Technology flexibility** - Upgrade Next.js without touching Python, and vice versa

## 📋 **Migration Checklist**

**When moving frontend to standalone deployment:**

### **✅ Code Changes (None Required)**
- No code changes needed - already portable

### **✅ Configuration Updates**
- [ ] Update `NEXT_PUBLIC_API_URL` to new backend location
- [ ] Update `NEXT_PUBLIC_AUTH0_BASE_URL` to new frontend domain
- [ ] Update Auth0 Dashboard callback URLs

### **✅ Infrastructure Setup**  
- [ ] Deploy frontend to chosen platform
- [ ] Configure environment variables
- [ ] Set up DNS/domain routing
- [ ] Configure SSL certificates

### **✅ Testing**
- [ ] Test email/password login
- [ ] Test Google OAuth flow  
- [ ] Test GitHub OAuth flow
- [ ] Test API communication
- [ ] Test error scenarios

## 🆘 **Troubleshooting Common Issues**

### **"OAuth buttons not showing"**
```bash
# Check environment variables
console.log(process.env.NEXT_PUBLIC_AUTH0_DOMAIN)
```

### **"Callback URL mismatch"**  
```bash
# Auth0 Dashboard must exactly match:
NEXT_PUBLIC_AUTH0_BASE_URL + "/auth/callback"
```

### **"API communication failed"**
```bash
# Check CORS on backend allows frontend domain
# Verify NEXT_PUBLIC_API_URL is correct
```

### **"JWT verification failed"**
```bash  
# Backend must have Auth0 domain and audience configured
# Check Auth0 JWKS endpoint accessibility
```

## 🎯 **Summary**

The Auth0 integration is designed for **maximum portability and independence**:

- **Zero shared libraries** between frontend and backend
- **Standard HTTP APIs** for all communication  
- **Environment-driven configuration** for any deployment scenario
- **Graceful degradation** when components are missing
- **Complete documentation** for standalone deployment

This architecture enables the frontend to be deployed **anywhere** while maintaining full Auth0 OAuth functionality! 🚀