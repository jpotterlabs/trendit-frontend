# Standalone Frontend Deployment Checklist

This checklist ensures the Trendit frontend with Auth0 integration works correctly when deployed standalone.

## ✅ Pre-Deployment Checklist

### 1. Dependencies
- [ ] `@auth0/auth0-react` is installed (`npm install @auth0/auth0-react`)
- [ ] All other dependencies are up to date (`npm install`)

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_API_URL` to your backend URL
- [ ] Configure Auth0 variables (if using OAuth):
  - [ ] `NEXT_PUBLIC_AUTH0_DOMAIN`
  - [ ] `NEXT_PUBLIC_AUTH0_CLIENT_ID` 
  - [ ] `NEXT_PUBLIC_AUTH0_AUDIENCE`
  - [ ] `NEXT_PUBLIC_AUTH0_BASE_URL`

### 3. Backend Compatibility
- [ ] Backend has Auth0 endpoints (`/auth0/health`, `/auth0/callback`)
- [ ] Backend database includes Auth0 fields (`auth0_user_id`, `auth0_provider`)
- [ ] CORS configured to allow your frontend domain
- [ ] Backend environment has Auth0 credentials

### 4. Auth0 Dashboard Configuration
- [ ] Application created in Auth0 Dashboard
- [ ] Callback URLs include your frontend domain
- [ ] Web Origins include your frontend domain
- [ ] Logout URLs include your frontend domain
- [ ] Social connections enabled (Google, GitHub)
- [ ] API audience configured

## 🚀 Deployment Steps

### 1. Build and Deploy
```bash
# Build the frontend
npm run build

# Deploy using your preferred method
# (Vercel, Netlify, Docker, etc.)
```

### 2. Environment Variables (Production)
Set these in your deployment platform:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://trendit-api.com
NEXT_PUBLIC_AUTH0_BASE_URL=https://your-frontend-domain.com
```

### 3. Auth0 Dashboard Updates
- [ ] Add production URLs to Allowed Callback URLs
- [ ] Add production URLs to Allowed Web Origins  
- [ ] Add production URLs to Allowed Logout URLs

## 🧪 Post-Deployment Testing

### 1. Basic Functionality
- [ ] Frontend loads without errors
- [ ] Login page accessible
- [ ] Email/password login works
- [ ] Dashboard accessible after login

### 2. Auth0 Integration (if configured)
- [ ] OAuth buttons visible on login page
- [ ] Google OAuth flow works end-to-end
- [ ] GitHub OAuth flow works end-to-end
- [ ] Users created in backend with Auth0 fields
- [ ] JWT tokens and API keys generated correctly

### 3. API Integration
- [ ] Frontend can communicate with backend
- [ ] Authentication headers passed correctly
- [ ] All API endpoints accessible
- [ ] Error handling works for API failures

## 📝 Configuration Examples

### Vercel Deployment
```bash
# vercel.json or environment variables
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.yourdomain.com",
    "NEXT_PUBLIC_AUTH0_DOMAIN": "your-tenant.auth0.com",
    "NEXT_PUBLIC_AUTH0_CLIENT_ID": "your_client_id",
    "NEXT_PUBLIC_AUTH0_AUDIENCE": "https://trendit-api.com",
    "NEXT_PUBLIC_AUTH0_BASE_URL": "https://trendit.yourdomain.com"
  }
}
```

### Netlify Deployment
```bash
# _redirects file for SPA routing
/*    /index.html   200

# Environment variables in Netlify dashboard
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
# ... etc
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Set environment variables (or use docker-compose)
ENV NEXT_PUBLIC_API_URL=https://api.yourdomain.com
ENV NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues:

1. **OAuth buttons not showing**
   - Check Auth0 environment variables are set
   - Ensure variables start with `NEXT_PUBLIC_`
   - Check browser console for configuration warnings

2. **Callback errors**
   - Verify callback URLs in Auth0 dashboard match exactly
   - Check `NEXT_PUBLIC_AUTH0_BASE_URL` is correct
   - Ensure HTTPS in production

3. **API communication failures**  
   - Check `NEXT_PUBLIC_API_URL` points to correct backend
   - Verify CORS settings on backend
   - Check network/firewall restrictions

4. **Build failures**
   - Ensure all dependencies installed (`npm ci`)
   - Check for TypeScript errors (`npm run build`)
   - Verify environment variables during build

## 📊 Health Checks

### Automated Health Checks
```javascript
// Add to your monitoring system
const healthChecks = [
  'GET /health',                    // Frontend health
  'GET /api/auth/health',          // Backend auth health  
  'GET /auth0/health',             // Auth0 integration health
];
```

### Manual Verification
- [ ] All pages load without JavaScript errors
- [ ] Authentication flows complete successfully
- [ ] User data persists correctly
- [ ] OAuth providers work in production environment

## 📚 Documentation Links

- [Auth0 Setup Guide](./AUTH0_SETUP_GUIDE.md)
- [Frontend Environment Configuration](.env.example)
- [Auth0 Dashboard](https://auth0.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

## 🆘 Support

If issues arise after following this checklist:

1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Test Auth0 configuration in Auth0 Dashboard
4. Ensure backend is accessible from frontend domain
5. Review CORS and authentication settings

## 🔒 Security Reminders

- [ ] Never expose Auth0 Client Secret in frontend
- [ ] Use HTTPS for all production deployments
- [ ] Regularly rotate API keys and secrets
- [ ] Monitor authentication logs for suspicious activity
- [ ] Keep Auth0 SDK and dependencies updated