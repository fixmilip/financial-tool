# Deployment Guide

## Option 1: Deploy to Vercel (Recommended)

### Method A: GitHub Integration (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your repository: `therealchandlerbing/vianeo-tools`
5. Vercel will auto-detect it's a Vite project
6. Click "Deploy"
7. Your site will be live at: `https://your-project-name.vercel.app`

### Method B: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Deploy to production
vercel --prod
```

## Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"

## Option 3: Local Development

```bash
# Start development server
npm run dev

# Server will be available at:
# http://localhost:5173/
```

## Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Environment

- **Node Version**: 18+
- **Package Manager**: npm
- **Build Tool**: Vite
- **Framework**: React + TypeScript

## Troubleshooting

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Blank Page
- Check browser console for errors
- Ensure all dependencies are installed: `npm install`
- Try clearing browser cache

### Deployment Issues
- Ensure `dist` folder is in `.gitignore`
- Verify `vercel.json` configuration is correct
- Check build logs for errors

## Current Deployment Status

✅ Built successfully
✅ All assets generated
✅ Ready for deployment

**Next Step**: Choose Option 1 (Vercel) or Option 2 (Netlify) above to deploy your calculator!
