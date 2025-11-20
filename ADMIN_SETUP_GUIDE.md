# Admin Panel Setup Guide

## Overview
This application now features a fully dynamic admin panel where all content can be managed without touching code.

## Quick Setup Steps

### 1. Fix NPM Cache Permissions
```bash
sudo chown -R 501:20 "/Users/arju/.npm"
```

### 2. Install Required Backend Packages
```bash
cd backend
npm install uuid
```

### 3. Install Required Frontend Packages
```bash
cd frontend
npm install react-quill
```

### 4. Set Admin Role Manually (FIRST TIME ONLY)

#### Step A: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Step B: Register Your Admin Account
1. Open the app in browser: `http://localhost:8080`
2. Click "Login" and register with your phone number
3. Complete the OTP verification
4. **Note your phone number** (e.g., +911234567890)

#### Step C: Set Admin Role in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Find the `users` collection
5. Locate your user document (search by phone number)
6. Click on the document
7. Add or edit the `role` field:
   - Field: `role`
   - Type: `string`
   - Value: `admin`
8. Save the document

#### Step D: Set Custom Claims (via Firebase Admin SDK)

Create a temporary script to set custom claims:

```javascript
// backend/setAdmin.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const phoneNumber = '+911234567890'; // REPLACE WITH YOUR PHONE NUMBER

async function setAdminClaim() {
  try {
    const user = await admin.auth().getUserByPhoneNumber(phoneNumber);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim set for user: ${phoneNumber}`);
    console.log(`User must log out and log in again for changes to take effect.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setAdminClaim();
```

Run the script:
```bash
cd backend
node setAdmin.js
```

#### Step E: Access Admin Panel
1. **Log out** from the application
2. **Log in again** (this refreshes your auth token with admin claims)
3. Navigate to: `http://localhost:8080/admin`
4. You should now see the full admin panel!

---

## Admin Panel Features

### Dashboard (`/admin`)
- View total orders, revenue, appointments, and bookings
- See recent orders and appointments
- Real-time analytics

### Content Management (`/admin/content`)
**Hero Sections Tab:**
- Create/Edit/Delete hero banners for the homepage
- Set title, subtitle, description, button text, and link
- Upload hero images
- Control active/inactive status and display order

**Features Tab:**
- Manage "Why Choose Us" features
- Add icons (emojis or text)
- Edit titles and descriptions

**Navigation Tab:**
- Manage navigation menu items
- Set paths and display order
- Toggle active/inactive

**Site Settings Tab:**
- Edit site name, email, phone
- Update WhatsApp number
- Manage business address

### Services Management (`/admin/services`) - TODO
- Full CRUD for services
- Image uploads
- Pricing management

### Products Management (`/admin/products`) - TODO
- Product catalog management
- Multi-image uploads
- Category and stock management

### Articles/Blog (`/admin/articles`) - TODO
- Rich text editor for blog posts
- SEO settings
- Featured post management

### Orders (`/admin/orders`) - TODO
- View all orders
- Update status and payment status
- Add tracking numbers

### Appointments (`/admin/appointments`) - TODO
- Manage medical appointments
- Calendar view
- Update status and add notes

### Bookings (`/admin/bookings`) - TODO
- Service bookings management
- View grooming, daycare, training bookings

### Users (`/admin/users`) - TODO
- View all registered users
- Manage roles

### Contact Submissions (`/admin/contacts`) - TODO
- View contact form submissions
- Respond to inquiries

### Media Library (`/admin/media`) - TODO
- Upload and manage images
- Organize files by folders

### Settings (`/admin/settings`) - TODO
- Manage time slots
- Product and article categories
- Vaccination schedules
- Email templates

---

## Database Collections Created

### `site_settings`
Stores general site configuration (contact info, business details)

### `hero_sections`
Homepage hero banners with:
- title, subtitle, description
- buttonText, buttonLink
- image URL
- active status and order

### `features`
"Why Choose Us" features with:
- title, description, icon
- active status and order

### `navigation`
Navigation menu items with:
- name, path, icon
- active status and order

---

## API Endpoints

### Public Endpoints
```
GET /api/site/settings          - Get site settings
GET /api/site/hero-sections     - Get active hero sections
GET /api/site/features          - Get active features
GET /api/site/navigation        - Get active navigation items
```

### Admin-Only Endpoints
```
PUT    /api/site/settings                - Update site settings
POST   /api/site/hero-sections           - Create hero section
PUT    /api/site/hero-sections/:id       - Update hero section
DELETE /api/site/hero-sections/:id       - Delete hero section
POST   /api/site/features                - Create feature
PUT    /api/site/features/:id            - Update feature
DELETE /api/site/features/:id            - Delete feature
POST   /api/site/navigation              - Create nav item
PUT    /api/site/navigation/:id          - Update nav item
DELETE /api/site/navigation/:id          - Delete nav item
POST   /api/upload/single                - Upload single image
POST   /api/upload/multiple              - Upload multiple images
DELETE /api/upload                       - Delete image
```

---

## Updated Frontend Pages (Now Dynamic)

### ✅ Home Page
- Fetches hero sections from database
- Fetches features dynamically
- Falls back to defaults if database is empty

### ✅ Contact Page
- Fetches contact info from site settings
- Functional contact form
- Dynamic WhatsApp link

### ⏳ Services Page (Still Hardcoded)
- TODO: Connect to database

### ⏳ Products Page (Still Hardcoded)
- TODO: Connect to database

### ⏳ Consultant Page (Still Hardcoded)
- TODO: Connect to articles collection

---

## Production Deployment Checklist

### Environment Variables
Ensure all these are set:
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_CERT_URL=

# Firebase Client (Frontend)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# API URLs
VITE_API_URL=https://your-api.com
FRONTEND_URL=https://your-frontend.com

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email (Nodemailer)
EMAIL_USER=
EMAIL_PASS=

# Twilio (WhatsApp/SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
```

### Firebase Security Rules
Update Firestore rules to restrict admin-only collections:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public content
    match /site_settings/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /hero_sections/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /features/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /navigation/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // ... (existing rules for other collections)
  }
}
```

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist
# Backend will serve these files in production mode
```

### Start Production Server
```bash
cd backend
NODE_ENV=production npm start
```

---

## Troubleshooting

### Admin Panel Shows "Access Denied"
1. Verify the `role` field in Firestore user document is set to `admin`
2. Verify custom claims are set (run setAdmin.js script)
3. **Log out and log in again** (tokens are cached)
4. Clear browser cache/cookies

### "Failed to fetch content" errors
1. Check backend is running on port 5001
2. Check API proxy configuration in vite.config.js
3. Verify Firebase credentials are correct
4. Check browser console for detailed errors

### Images not uploading
1. Verify Firebase Storage is enabled
2. Check storage bucket permissions
3. Verify `uuid` package is installed
4. Check Firebase service account has Storage Admin role

---

## Next Steps

1. ✅ Install missing npm packages (uuid, react-quill)
2. ✅ Set up first admin user
3. 🔄 Populate initial content via admin panel:
   - Add hero sections
   - Add features
   - Update site settings
4. 🔄 Complete remaining admin pages:
   - Service management
   - Product management
   - Article/blog management
   - Orders, appointments, bookings views
5. 🔄 Update remaining frontend pages to use dynamic data
6. 🔄 Configure production environment
7. 🔄 Update Firebase security rules
8. 🔄 Deploy to production

---

## Support

For issues or questions:
- Check backend logs: Check terminal running `npm run dev`
- Check frontend console: Browser Developer Tools → Console
- Check Firebase Console for database/auth issues
- Review API responses in Network tab

