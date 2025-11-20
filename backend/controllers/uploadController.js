import { storage } from '../config/firebase.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Upload single image
export const uploadSingle = upload.single('image');

// Upload multiple images
export const uploadMultiple = upload.array('images', 10);

// Upload image to Firebase Storage
export const uploadToFirebase = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const folder = req.body.folder || 'general';
    const fileName = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;

    const bucket = storage.bucket();
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Upload error:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Make the file public
          await fileUpload.makePublic();

          // Get public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

          res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
              url: publicUrl,
              fileName: fileName,
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype
            }
          });
          resolve();
        } catch (error) {
          console.error('Error making file public:', error);
          reject(error);
        }
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// Upload multiple images to Firebase Storage
export const uploadMultipleToFirebase = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = req.files;
    const folder = req.body.folder || 'general';
    const bucket = storage.bucket();
    const uploadedFiles = [];

    for (const file of files) {
      const fileName = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;
      const fileUpload = bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', async () => {
          try {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            uploadedFiles.push({
              url: publicUrl,
              fileName: fileName,
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
        stream.end(file.buffer);
      });
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      error: error.message
    });
  }
};

// Delete file from Firebase Storage
export const deleteFromFirebase = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'File name is required'
      });
    }

    const bucket = storage.bucket();
    await bucket.file(fileName).delete();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};
