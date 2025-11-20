import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();
const auth = admin.auth();

// ⚠️ IMPORTANT: Replace with your actual phone number!
// Format: +[country code][phone number] (e.g., +911234567890)
const ADMIN_PHONE_NUMBER = '+911234567890'; // ⬅️ CHANGE THIS!

async function setAdminRole() {
  console.log('\n🔧 Setting up admin role...\n');

  try {
    // Step 1: Get user by phone number
    console.log(`📞 Looking for user with phone: ${ADMIN_PHONE_NUMBER}`);
    const user = await auth.getUserByPhoneNumber(ADMIN_PHONE_NUMBER);
    console.log(`✅ Found user: ${user.uid}`);

    // Step 2: Set custom claims
    console.log(`🔐 Setting admin custom claim...`);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin custom claim set successfully`);

    // Step 3: Update Firestore user document
    console.log(`💾 Updating Firestore user document...`);
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({
        role: 'admin',
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Firestore user document updated`);
    } else {
      await userRef.set({
        uid: user.uid,
        phoneNumber: ADMIN_PHONE_NUMBER,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Firestore user document created`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✨ SUCCESS! Admin role set for ${ADMIN_PHONE_NUMBER}`);
    console.log(`${'='.repeat(60)}\n`);
    console.log(`📝 IMPORTANT NEXT STEPS:`);
    console.log(`   1. If you're currently logged in, LOG OUT of the app`);
    console.log(`   2. LOG IN AGAIN to refresh your auth token`);
    console.log(`   3. Navigate to /admin to access the admin panel\n`);

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);

    if (error.code === 'auth/user-not-found') {
      console.log(`⚠️  User not found. Please:`);
      console.log(`   1. Register the account in the app first`);
      console.log(`   2. Complete phone verification`);
      console.log(`   3. Then run this script again\n`);
    } else if (error.code === 'auth/invalid-phone-number') {
      console.log(`⚠️  Invalid phone number format. Use: +[country code][number]`);
      console.log(`   Example: +911234567890\n`);
    }

    process.exit(1);
  }
}

// Verify phone number is set
if (ADMIN_PHONE_NUMBER === '+911234567890') {
  console.log(`\n⚠️  WARNING: You haven't changed the phone number!\n`);
  console.log(`Please edit this file (backend/setAdmin.js) and set:`);
  console.log(`   ADMIN_PHONE_NUMBER = '+your_actual_phone_number'\n`);
  console.log(`Then run: node setAdmin.js\n`);
  process.exit(1);
}

setAdminRole();
