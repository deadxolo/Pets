# Quick Start Guide

## Fix NPM Permission Issue (Required First!)

Your npm cache has permission issues. Run this command first:

```bash
sudo chown -R 501:20 "/Users/arju/.npm"
```

Or alternatively, clear the cache with sudo:

```bash
sudo npm cache clean --force
```

## Setup Steps

### 1. Configure Firebase

Before running the app, you need to set up Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database** and **Phone Authentication**
4. Get your web app configuration:
   - Go to Project Settings → General → Your apps
   - Click on Web app (</>) and copy the config
   - Update `frontend/.env` with these values

5. Get your service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
   - Update `backend/.env` with the values from this JSON

### 2. Update Environment Files

**Backend** (`backend/.env`):
- Replace Firebase credentials from the service account JSON
- Add a secure JWT_SECRET
- (Optional) Add Razorpay, Email, and other service credentials

**Frontend** (`frontend/.env`):
- Replace Firebase credentials from web app config
- Ensure VITE_API_URL points to `http://localhost:5000/api`

### 3. Install Dependencies & Run

Open **TWO terminal windows**:

#### Terminal 1 - Backend:
```bash
cd /Users/arju/Desktop/Pets/backend
npm install
npm start
```

Backend will run on: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd /Users/arju/Desktop/Pets/frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Verify Setup

1. Open browser to `http://localhost:3000`
2. You should see the Pet Services home page
3. Backend API health check: `http://localhost:5000/api/health`

## Common Issues

### Backend won't start
- Check if port 5000 is already in use
- Verify Firebase credentials in `.env`
- Make sure all required npm packages are installed

### Frontend shows errors
- Ensure backend is running first
- Check browser console for specific errors
- Verify Firebase config in frontend `.env`

### Phone authentication not working
- Enable Phone Authentication in Firebase Console
- Add your domain to authorized domains in Firebase
- For localhost, it should work by default

## Next Steps

1. **Set up Firestore Security Rules**
   - Copy rules from `backend/DATABASE_SCHEMA.md`
   - Go to Firebase Console → Firestore Database → Rules
   - Paste and publish

2. **Test the application**
   - Try phone authentication
   - Browse products and add to cart
   - Book an appointment

3. **Add sample data** (Optional)
   - Use Firebase Console to manually add some products
   - Or create admin routes to seed data

## Quick Command Reference

```bash
# Fix npm permissions
sudo chown -R 501:20 "/Users/arju/.npm"

# Backend
cd backend
npm install
npm start          # Production
npm run dev        # Development (with nodemon)

# Frontend
cd frontend
npm install
npm run dev        # Development
npm run build      # Production build

# Check health
curl http://localhost:5000/api/health
```

## Need Help?

- Check the main README.md for detailed documentation
- Review DATABASE_SCHEMA.md for database structure
- Check backend logs for API errors
- Check browser console for frontend errors
