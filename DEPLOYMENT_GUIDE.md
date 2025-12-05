# 🚀 Production Deployment Guide

This guide will help you deploy your Vehicle Breakdown Assistance platform to production using GitHub Pages.

---

## ✅ Pre-Deployment Checklist

Before deployment, ensure:

- [x] Frontend code is complete
- [ ] Firebase project is created
- [ ] Environment variables are configured
- [ ] Local testing is successful
- [ ] Admin account is created
- [ ] Sample data is added

---

## 🔥 Step 1: Firebase Setup (15 minutes)

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `vehicle-breakdown-assistance`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 1.2 Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (closest to your users)
5. Click **"Enable"**

### 1.3 Enable Authentication

1. Go to **Build → Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"**
6. Click **"Save"**

### 1.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **Web icon (</>) **
4. Register app with a nickname
5. **Copy the configuration values**

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## 💻 Step 2: Local Configuration (5 minutes)

### 2.1 Create Environment File

```bash
cd frontend
cp .env.example .env
```

### 2.2 Edit .env File

Open `frontend/.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🧪 Step 3: Local Testing (10 minutes)

### 3.1 Install Dependencies

```bash
npm run install-deps
```

### 3.2 Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 3.3 Test User Flow

1. **Register** a new account
2. **Login** with your credentials
3. Test user features:
   - Select a vehicle type
   - Browse problems
   - View a solution

### 3.4 Create Admin Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Firestore Database**
3. Find the **`users`** collection
4. Click on your user document
5. Click **"Add field"**:
   - Field: `isAdmin`
   - Type: `boolean`
   - Value: `true`
6. Click **"Update"**

### 3.5 Test Admin Features

1. **Logout** from your account
2. **Login** again (admin status now active)
3. You should see admin menu options
4. Add a vehicle type (e.g., "2-Wheeler")
5. Add a problem for that vehicle
6. Add a solution with a YouTube link

**Test YouTube URL format:**
```
https://www.youtube.com/watch?v=VIDEO_ID
```

---

## 🔐 Step 4: Firebase Security Rules (10 minutes)

### 4.1 Configure Firestore Rules

1. Go to **Firestore Database → Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == userId || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Vehicles - public read, admin write
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Problems - public read, admin write
    match /problems/{problemId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Solutions - public read, admin write
    match /solutions/{solutionId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Feedback - authenticated users can create, admin can manage
    match /feedback/{feedbackId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
  }
}
```

3. Click **"Publish"**

---

## 🌐 Step 5: GitHub Repository Setup (5 minutes)

### 5.1 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `vehicle-breakdown-assistance`
3. Make it **Public**
4. Don't initialize with README (you already have one)
5. Click **"Create repository"**

### 5.2 Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Production-ready Firebase app"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/vehicle-breakdown-assistance.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🔑 Step 6: Configure GitHub Secrets (5 minutes)

### 6.1 Add Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

Add these 6 secrets (use your Firebase values):

| Secret Name | Value |
|-------------|-------|
| `VITE_FIREBASE_API_KEY` | Your API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

---

## 📄 Step 7: Enable GitHub Pages (2 minutes)

### 7.1 Configure Pages

1. Go to repository **Settings** → **Pages**
2. Under **"Source"**, select:
   - **Deploy from a branch**
3. Under **"Branch"**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **"Save"**

> **Note:** The `gh-pages` branch will be created automatically by GitHub Actions on first deployment.

---

## 🚀 Step 8: Deploy (Automatic!)

### 8.1 Trigger Deployment

Every push to the `main` branch automatically triggers deployment.

To manually trigger:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 8.2 Monitor Deployment

1. Go to your repository
2. Click on **"Actions"** tab
3. You should see a workflow running: **"Deploy to GitHub Pages"**
4. Click on the workflow to see progress
5. Wait for all steps to complete (usually 2-3 minutes)

### 8.3 Access Your Live Site

Once deployment is complete, your site will be available at:

```
https://YOUR_USERNAME.github.io/vehicle-breakdown-assistance/
```

---

## ✅ Step 9: Post-Deployment Verification

### 9.1 Test Live Site

Visit your deployed URL and test:

- [ ] Home page loads correctly
- [ ] User can register
- [ ] User can login
- [ ] Vehicle selection works
- [ ] Problems display
- [ ] Solutions show YouTube videos
- [ ] Feedback submission works
- [ ] Admin can login
- [ ] Admin dashboard shows stats
- [ ] Admin can add/delete vehicles
- [ ] Admin can add/delete problems
- [ ] Admin can add/delete solutions
- [ ] Admin can manage feedback

### 9.2 Common Issues

**Issue: Blank page after deployment**
- Check GitHub Actions logs for build errors
- Verify all secrets are added correctly
- Check browser console for errors

**Issue: Firebase connection failed**
- Double-check Firebase credentials in GitHub Secrets
- Ensure Firebase project is created
- Verify Firestore is enabled

**Issue: Admin features not working**
- Ensure you set `isAdmin: true` in Firestore
- Logout and login again after setting admin flag
- Check Firestore security rules

---

## 🔄 Updating Your Site

### Making Changes

1. Edit code locally
2. Test with `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. GitHub Actions will automatically redeploy

---

## 📊 Monitoring

### View Analytics

1. Go to Firebase Console
2. Navigate to **Analytics** (if enabled)
3. View user engagement, authentication events, etc.

### View Database

1. Go to **Firestore Database**
2. Browse collections: `users`, `vehicles`, `problems`, `solutions`, `feedback`
3. Monitor real-time data

---

## 🎯 Production Best Practices

### 1. Regular Backups
- Export Firestore data monthly
- Keep backup of security rules

### 2. Security
- Regularly review Firestore security rules
- Monitor authentication logs
- Keep dependencies updated

### 3. Performance
- Monitor Firebase quota usage
- Optimize images and assets
- Use lazy loading where possible

### 4. Maintenance
- Update npm packages quarterly
- Test critical flows monthly
- Keep documentation updated

---

## 🛠️ Troubleshooting

### Build Fails on GitHub Actions

**Check:**
1. All secrets are correctly added
2. `vite.config.js` has correct base path
3. Review Actions logs for specific error

**Solution:**
```bash
# Test build locally first
npm run build
npm run preview
```

### Firebase Quota Exceeded

**Free Tier Limits:**
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage

**Solution:**
- Upgrade to Blaze (pay-as-you-go) plan
- Optimize queries to reduce reads

### YouTube Videos Not Showing

**Check:**
1. Video URL format is correct
2. Video is public (not private/unlisted)
3. Use full YouTube URL

**Correct format:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

---

## 📞 Support

**Issues:**
- GitHub Issues: Create an issue in your repository
- Firebase: Check [Firebase Status](https://status.firebase.google.com)

**Resources:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 🎉 Congratulations!

Your Vehicle Breakdown Assistance platform is now live in production!

**Next Steps:**
1. Share your URL with users
2. Add sample vehicle data
3. Monitor usage via Firebase Console
4. Gather user feedback
5. Iterate and improve

**Your live URL:**
```
https://YOUR_USERNAME.github.io/vehicle-breakdown-assistance/
```

---

**Built with ❤️ using React, Vite, and Firebase**
