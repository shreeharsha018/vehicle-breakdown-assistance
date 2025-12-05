# 🚀 Complete Deployment Guide

## Step 1: Add Firebase Secrets to GitHub

Your Firebase credentials need to be stored as GitHub secrets.

### How to Add Secrets:

1. **Go to your GitHub repository**
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

| Secret Name | Value (from frontend/.env) |
|------------|---------------------------|
| `VITE_FIREBASE_API_KEY` | Your API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

**Important:** Copy values from `frontend/.env` file (without `VITE_` prefix in the `.env` file)

---

## Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
3. Click **Save**

---

## Step 3: Push to GitHub

```bash
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main
```

---

## Step 4: Wait for Deployment

1. Go to **Actions** tab
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait for green checkmark ✅ (takes 2-3 minutes)

---

## Step 5: Access Your Live App

Your app will be available at:
```
https://shreeharsha018.github.io/vehicle-breakdown-assistance/
```

**Note:** Replace `shreeharsha018` with your GitHub username if different.

---

## 🔄 Automatic Updates

Every time you push to `main` or `master` branch:
- GitHub Actions automatically rebuilds
- Deploys to GitHub Pages
- Your live site updates in 2-3 minutes

---

## 🔧 Troubleshooting

### Build Fails?
- **Check Actions tab** for error logs
- **Verify secrets** are added correctly
- Ensure all Firebase config values are correct

### 404 Error on Live Site?
- Vite config already has correct base: `/vehicle-breakdown-assistance/`
- Wait a few minutes after first deployment
- Clear browser cache (Ctrl+Shift+R)

### Firebase Not Working?
- Double-check all 6 secrets are added
- Ensure Firebase project is created and configured
- Check Firebase Console for authentication/Firestore setup

---

## ✅ Quick Checklist

- [ ] Add all 6 Firebase secrets to GitHub
- [ ] Enable GitHub Pages (Source: GitHub Actions)
- [ ] Push code to GitHub
- [ ] Wait for deployment (watch Actions tab)
- [ ] Visit your live URL
- [ ] Test login, registration, and features

---

## 📝 Important Files

- **Workflow**: `.github/workflows/deploy.yml` (auto-deployment config)
- **Vite Config**: `frontend/vite.config.js` (base URL config)
- **Firebase Config**: `frontend/.env` (local) + GitHub Secrets (production)

---

## 🎉 You're Ready!

Once you complete Steps 1-3, your app will be live on GitHub Pages! 🚀
