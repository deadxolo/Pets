import { auth, db } from '../config/firebase.js';
import jwt from 'jsonwebtoken';

// Register or login user with phone number
export const verifyPhoneOTP = async (req, res) => {
  try {
    const { idToken, phoneNumber } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists in Firestore
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    let userData;
    if (!userDoc.exists) {
      // Create new user
      userData = {
        uid,
        phoneNumber: decodedToken.phone_number || phoneNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user',
        profile: {
          name: '',
          email: '',
          address: '',
          pets: []
        }
      };
      await userRef.set(userData);
    } else {
      userData = userDoc.data();
      // Update last login
      await userRef.update({
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    }

    // Generate custom JWT (optional, if you want to use custom JWT alongside Firebase)
    const customToken = jwt.sign(
      { uid, phoneNumber: userData.phoneNumber, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      user: userData,
      token: customToken,
      firebaseToken: idToken
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Authentication failed', message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: userDoc.data() });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.uid;
    delete updates.role;
    delete updates.createdAt;

    updates.updatedAt = new Date().toISOString();

    await db.collection('users').doc(uid).update(updates);

    const updatedUser = await db.collection('users').doc(uid).get();
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser.data()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
};

// Add pet to user profile
export const addPet = async (req, res) => {
  try {
    const uid = req.user.uid;
    const petData = {
      id: `pet_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPets = userDoc.data().profile?.pets || [];
    currentPets.push(petData);

    await userRef.update({
      'profile.pets': currentPets,
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Pet added successfully',
      pet: petData
    });
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ error: 'Failed to add pet', message: error.message });
  }
};

// Logout (client-side handles Firebase signout, this can clear any server-side sessions if needed)
export const logout = async (req, res) => {
  try {
    // If you maintain server-side sessions, clear them here
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed', message: error.message });
  }
};
