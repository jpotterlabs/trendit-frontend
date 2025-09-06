# Trendit Frontend - Standalone Deployment

This is the standalone, portable frontend for the Trendit Reddit data collection platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## 🔧 Configuration

1. Copy `.env.example` to `.env.local`
2. Configure your API URL and Auth0 settings
3. See [Auth0 Setup Guide](./AUTH0_SETUP_GUIDE.md) for OAuth configuration

## 📚 Documentation

- [Auth0 Setup Guide](./AUTH0_SETUP_GUIDE.md) - OAuth configuration
- [Architecture Overview](./AUTH0_ARCHITECTURE.md) - System design and portability
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Production deployment

## 🌟 Features

- ✅ Complete Auth0 OAuth integration (Google, GitHub)
- ✅ Portable architecture - deploy anywhere
- ✅ Environment-driven configuration
- ✅ Graceful degradation when Auth0 unavailable
- ✅ Zero shared libraries with backend
- ✅ Ready for Vercel, Netlify, Docker, etc.

## 🏗️ Deployment Platforms

This frontend can be deployed on any platform supporting Next.js:

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **AWS/GCP/Azure**: Cloud platform hosting
- **Traditional servers**: VPS or dedicated hosting

## 🔗 API Integration

Configure your backend API URL in environment variables:

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🛡️ Security

- Auth0 Client Secret never exposed to frontend
- Environment variables properly scoped with `NEXT_PUBLIC_`
- JWT tokens handled securely
- HTTPS required for production OAuth flows

---

Built with ❤️ for maximum portability and deployment flexibility.
