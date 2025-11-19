import { auth } from '../config/firebase.js';
import jwt from 'jsonwebtoken';

// Verify Firebase ID token
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
  }
};

// Verify JWT token (optional, if using custom JWT alongside Firebase)
export const verifyJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
  }
};

// Check if user is admin (you can customize this based on your requirements)
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check custom claims or database for admin role
    const userRecord = await auth.getUser(req.user.uid);
    if (userRecord.customClaims?.admin === true) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default { verifyFirebaseToken, verifyJWT, isAdmin };
