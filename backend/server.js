import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

// Import routes
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import appointmentRoutes from './routes/appointments.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import consultantRoutes from './routes/consultant.js';
import bookingRoutes from './routes/booking.js';
import contactRoutes from './routes/contact.js';
import vaccinationRoutes from './routes/vaccination.js';
import paymentRoutes from './routes/payment.js';
import siteSettingsRoutes from './routes/siteSettings.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://127.0.0.1:5001', 'http://localhost:5001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Pets Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/consultant', consultantRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/vaccination', vaccinationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/site', siteSettingsRoutes);
app.use('/api/upload', uploadRoutes);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  // Production: Serve built frontend files
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDistPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Development: Proxy non-API requests to Vite dev server
  const VITE_SERVER = process.env.VITE_DEV_SERVER || 'http://localhost:3000';

  app.use('*', (req, res) => {
    // Skip API routes (already handled above)
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Proxy to Vite dev server
    const targetUrl = `${VITE_SERVER}${req.originalUrl}`;
    const viteUrl = new URL(targetUrl);

    // Clean up headers
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['connection'];

    const options = {
      hostname: viteUrl.hostname,
      port: viteUrl.port,
      path: viteUrl.pathname + viteUrl.search,
      method: req.method,
      headers: headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // Copy status and headers
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      // Pipe the response
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) {
        res.status(502).send('Vite dev server not available. Make sure frontend is running on port 3000.');
      }
    });

    // Pipe the request
    req.pipe(proxyReq, { end: true });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n🌐 Access your app at: http://localhost:${PORT}`);
  console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n⚠️  Frontend runs internally on port 3000 (proxied)`);
    console.log(`   Always use port ${PORT} to access the app!`);
  }
  console.log(`${'='.repeat(60)}\n`);
});

export default app;
