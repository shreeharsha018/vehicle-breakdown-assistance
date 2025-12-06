# Vehicle Breakdown Assistance Platform

🚗 **A complete 24/7 vehicle breakdown assistance platform** providing roadside support solutions for 2-wheelers, 3-wheelers, and 4-wheelers.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Firebase](https://img.shields.io/badge/firebase-10.7.0-orange)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 👥 For Users
- 🔐 **Secure Authentication** - Email/password registration and login
- 🚙 **Vehicle Selection** - Support for 2W, 3W, and 4W vehicles
- 🔍 **Problem Browser** - Find solutions for common vehicle issues
- 📹 **Video Tutorials** - Step-by-step YouTube video guides
- 📍 **GPS Location** - Automatic location capture for assistance
- ⭐ **Feedback System** - Rate and review solutions
- 💬 **Community Feedback** - View ratings from other users

### 👨‍💼 For Admins
- 📊 **Dashboard** - Real-time statistics and overview
- 🚗 **Vehicle Management** - Add/delete vehicle types
- 🔧 **Problem Management** - Manage vehicle problems database
- 💡 **Solution Management** - Create comprehensive solutions with videos
- 📝 **Feedback Moderation** - Approve/reject user feedback
- 👥 **User Oversight** - Monitor platform usage

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **Build Tool** | Vite 5 | Fast bundling & dev server |
| **Routing** | React Router 6 | Client-side navigation |
| **Backend** | Firebase | Serverless platform |
| **Authentication** | Firebase Auth | User management |
| **Database** | Firestore | NoSQL cloud database |
| **Hosting** | GitHub Pages | Static site hosting |
| **CI/CD** | GitHub Actions | Automated deployment |

---

## 📁 Project Structure

```
vehicle-breakdown-assistance/
├── frontend/                    # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── user/           # User dashboard & features
│   │   │   └── admin/          # Admin panel
│   │   ├── components/         # Reusable components
│   │   ├── config/             # Firebase configuration
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example            # Environment template
├── .github/workflows/
│   └── deploy.yml              # Automated deployment
├── .gitignore
├── package.json                # Root package file
├── README.md                   # This file
├── FIREBASE_SETUP.md           # Firebase setup guide
├── SETUP_INSTRUCTIONS.md       # Local setup guide
└── START_HERE.md               # Quick start guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- Git

### 1. Clone Repository
```bash
git clone https://github.com/shreeharsha018/vehicle-breakdown-assistance.git
cd vehicle-breakdown-assistance
```

### 2. Install Dependencies
```bash
npm run install-deps
# Or manually:
cd frontend && npm install
```

### 3. Firebase Setup
Create a Firebase project and get your credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable **Firestore Database** (production mode)
4. Enable **Authentication** → Email/Password
5. Get your config from Project Settings

### 4. Configure Environment
```bash
cd frontend
cp .env.example .env
# Edit .env with your Firebase credentials
```

Your `.env` should look like:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Run Locally
```bash
npm run dev
# Access at http://localhost:5173
```

### 6. Create Admin Account
1. Register a new user
2. Go to Firebase Console → Firestore Database
3. Find your user document in `users` collection
4. Add field: `isAdmin: true`
5. Logout and login again

---

## 📦 Deployment

### Deploy to GitHub Pages

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Configure GitHub Secrets**

Go to repository **Settings → Secrets and variables → Actions**

Add these secrets:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

3. **Enable GitHub Pages**

Go to **Settings → Pages**
- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`

4. **Automatic Deployment**

Every push to `main` triggers automatic deployment via GitHub Actions.

Access your site at: `https://shreeharsha018.github.io/vehicle-breakdown-assistance/`

---

## 🔐 Firebase Security

### Firestore Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Vehicles - public read, admin write
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Problems - public read, admin write
    match /problems/{problemId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Solutions - public read, admin write
    match /solutions/{solutionId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Feedback - authenticated users can create, admin can manage
    match /feedback/{feedbackId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

---

## 📚 Available Scripts

From project root:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run install-deps # Install frontend dependencies
```

---

## 🎨 UI/UX Highlights

- ✅ **Minimalist Design** - Apple/Stripe inspired aesthetic
- ✅ **Fully Responsive** - Mobile, tablet, desktop optimized
- ✅ **Modern Color Palette** - Professional blue theme
- ✅ **Smooth Animations** - Polished user experience
- ✅ **Intuitive Navigation** - Easy to use interface
- ✅ **Loading States** - Clear feedback for async operations

---

## 🗂️ Database Collections

### 1. `users`
```javascript
{
  uid: string,
  email: string,
  fullName: string,
  phone: string,
  isAdmin: boolean,
  createdAt: timestamp
}
```

### 2. `vehicles`
```javascript
{
  name: string,          // "2-Wheeler"
  type: string,          // "2w"
  description: string,
  createdAt: timestamp
}
```

### 3. `problems`
```javascript
{
  vehicleType: string,   // "2w", "3w", "4w"
  title: string,
  description: string,
  createdAt: timestamp
}
```

### 4. `solutions`
```javascript
{
  problemId: string,
  title: string,
  steps: array,
  tools: array,
  safetyTips: array,
  videoUrl: string,      // YouTube URL
  createdAt: timestamp
}
```

### 5. `feedback`
```javascript
{
  userId: string,
  solutionId: string,
  rating: number,        // 1-5
  comment: string,
  location: {
    lat: number,
    lng: number
  },
  isApproved: boolean,
  createdAt: timestamp
}
```

---

## 🧪 Testing

### Local Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Vehicle selection displays correctly
- [ ] Problems load for each vehicle type
- [ ] Solutions display with YouTube videos
- [ ] GPS location captures
- [ ] Feedback submission works
- [ ] Admin login works (with isAdmin flag)
- [ ] Admin can add vehicles
- [ ] Admin can add problems
- [ ] Admin can add solutions
- [ ] Admin can approve/reject feedback

---

## 📖 Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Detailed Firebase configuration
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Step-by-step setup
- **[START_HERE.md](./START_HERE.md)** - Quick overview
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For issues or questions:
- Create an [issue](https://github.com/shreeharsha018/vehicle-breakdown-assistance/issues)
- Email: support@vba.com

---

## 🎯 Roadmap

- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time operator tracking
- [ ] Payment integration
- [ ] Advanced analytics

---

**Built with ❤️ using React and Firebase**

🌟 Star this repo if you find it helpful!