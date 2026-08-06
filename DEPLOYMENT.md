# Deployment Guide for Vercel

## Setup Steps

### 1. Push code to GitHub
```bash
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Select the root folder as project root
5. Click "Deploy"

### 3. Add Environment Variables
After deployment, go to **Settings** → **Environment Variables** and add:

```
VITE_SUPABASE_URL=https://xgjrwtsbbwwbjuaksrgi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ZmNnqHxCQfxZIct1JDZaZw_tRQMoePE
```

### 4. Redeploy
1. Click "Deployments"
2. Find the latest deployment
3. Click the three dots → "Redeploy"

Or push a new commit to trigger auto-redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Verification
- Check Vercel deployment status
- Visit your app URL
- Try logging in with Supabase auth
- If you see the login page, deployment is successful!

## Troubleshooting

### "This page didn't load"
1. Check Vercel → Deployments → Logs for errors
2. Verify environment variables are set in Vercel Settings
3. Make sure Supabase project is active and accessible
4. Trigger a redeploy after adding env vars

### Build Fails
1. Check build logs in Vercel
2. Ensure `npm run build` works locally
3. Check Node.js version in Vercel (must be 18+)

### App loads but shows blank/error
1. Open browser DevTools → Console for errors
2. Check Supabase connection status
3. Verify auth is working (try login page)
