# Pet Services - Full Stack Application

A comprehensive pet services platform built with React.js (frontend) and Node.js (backend) with Firebase Firestore database.

## Features

### Core Functionality
- ✅ **Medical Service Packages & Appointments** - Book medical services for your pets
- ✅ **Consultant Services** - Pet health tips, grooming advice, training guidance, seasonal care
- ✅ **Service Bookings** - Grooming, veterinary services, pet daycare, and training
- ✅ **E-commerce** - Pet food, toys, accessories, and medicine with full shopping cart
- ✅ **Online Booking System** - Service selection, date/time picker, WhatsApp & email confirmations
- ✅ **Contact System** - Phone, WhatsApp button, email, Google Maps, contact form
- ✅ **Vaccination Tracking** - Track and manage pet vaccination records
- ✅ **Phone Authentication** - OTP-based authentication via Firebase
- ✅ **Payment Integration** - Razorpay payment gateway for orders and services

## Tech Stack

### Frontend
- **React.js 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Firebase** - Authentication and Firestore database
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **React DatePicker** - Date and time selection
- **React Phone Input** - Phone number input with country codes
- **Formik & Yup** - Form handling and validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Admin SDK** - Server-side Firebase operations
- **Razorpay** - Payment processing
- **Nodemailer** - Email notifications
- **Twilio** - WhatsApp/SMS notifications (optional)
- **Multer** - File upload handling
- **JWT** - Token-based authentication

### Database
- **Firebase Firestore** - NoSQL cloud database

## Project Structure

```
Pets/
├── backend/
│   ├── config/
│   │   └── firebase.js           # Firebase Admin configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── appointmentController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── consultantController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   ├── vaccinationController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── auth.js                # Authentication middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── appointments.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── consultant.js
│   │   ├── booking.js
│   │   ├── contact.js
│   │   ├── vaccination.js
│   │   └── payment.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── whatsappService.js
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   └── DATABASE_SCHEMA.md
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── config/
    │   │   ├── firebase.js
    │   │   └── api.js
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Services.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Appointments.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── Consultant.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Vaccination.jsx
    │   │   ├── Profile.jsx
    │   │   ├── MyOrders.jsx
    │   │   ├── MyAppointments.jsx
    │   │   └── MyBookings.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Razorpay account (for payments)
- Email account (Gmail recommended for SMTP)

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the steps
   - Enable Firestore Database (Start in production mode)
   - Enable Authentication → Phone Authentication

2. **Get Firebase Config**
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the configuration object

3. **Generate Service Account Key**
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

4. **Set Up Firestore Security Rules**
   - Copy the security rules from `backend/DATABASE_SCHEMA.md`
   - Go to Firestore Database → Rules tab
   - Paste and publish the rules

5. **Create Firestore Indexes**
   - Follow the index creation guide in `backend/DATABASE_SCHEMA.md`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development

   # Firebase (from service account JSON)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

   # JWT
   JWT_SECRET=your-super-secret-jwt-key

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server**
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your credentials:
   ```env
   # Firebase (from Firebase console web app config)
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Backend API
   VITE_API_URL=http://localhost:5000/api

   # Razorpay
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

   # Google Maps (for contact page)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Application will run on `http://localhost:3000`

## Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - Select "2-Step Verification"
   - Scroll down to "App passwords"
   - Generate a new app password for "Mail"
3. Use this app password in the `EMAIL_PASSWORD` field

## Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Add the keys to your `.env` files

## WhatsApp/SMS Setup (Optional)

1. Sign up for [Twilio](https://www.twilio.com/)
2. Get your Account SID, Auth Token, and Phone Number
3. For WhatsApp: Enable WhatsApp in Twilio console
4. Add credentials to backend `.env` file
5. Uncomment Twilio code in `backend/utils/whatsappService.js`

## API Endpoints

### Authentication
- `POST /api/auth/verify-otp` - Verify OTP and login/register
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/add-pet` - Add pet to profile

### Services
- `GET /api/services` - Get all services
- `GET /api/services/medical-packages` - Get medical packages
- `GET /api/services/:id` - Get service by ID

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `GET /api/appointments/available-slots` - Get available time slots
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Products
- `GET /api/products` - Get all products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/:id/review` - Add product review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order

### Bookings
- `POST /api/booking` - Create service booking
- `GET /api/booking/my-bookings` - Get user bookings
- `GET /api/booking/slots` - Get available booking slots

### Consultant
- `GET /api/consultant/articles` - Get all articles
- `GET /api/consultant/articles/:id` - Get article by ID
- `POST /api/consultant/request` - Request consultation
- `GET /api/consultant/my-consultations` - Get user consultations

### Vaccination
- `POST /api/vaccination` - Add vaccination record
- `GET /api/vaccination/my-vaccinations` - Get user vaccination records
- `GET /api/vaccination/upcoming` - Get upcoming vaccinations
- `GET /api/vaccination/schedule` - Get vaccination schedule

### Contact
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/info` - Get contact information

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/service/create` - Create service payment
- `POST /api/payment/service/verify` - Verify service payment

## Database Collections

See `backend/DATABASE_SCHEMA.md` for detailed schema and security rules.

Main collections:
- `users` - User profiles and authentication data
- `services` - Service offerings
- `appointments` - Medical appointments
- `products` - E-commerce products
- `orders` - Customer orders
- `bookings` - Service bookings (grooming, daycare, training)
- `articles` - Consultant articles and tips
- `consultations` - Consultation requests
- `vaccinations` - Pet vaccination records
- `contacts` - Contact form submissions

## Development

### Adding New Features

1. **Backend**: Add controller → Add route → Register in `server.js`
2. **Frontend**: Create page/component → Add route in `App.jsx`

### Testing

Run backend:
```bash
cd backend
npm start
```

Run frontend:
```bash
cd frontend
npm run dev
```

Test endpoints using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

## Deployment

### Backend Deployment (Recommended: Railway, Render, or Heroku)

1. Create account on hosting platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Recommended: Vercel or Netlify)

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Vercel/Netlify

3. Update `VITE_API_URL` to your backend URL

## Troubleshooting

### Common Issues

1. **Firebase Authentication Error**
   - Ensure Phone Authentication is enabled in Firebase Console
   - Check Firebase config in both frontend and backend

2. **CORS Error**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check CORS configuration in `server.js`

3. **Payment Integration**
   - Use Razorpay test keys for development
   - Verify Razorpay webhooks for production

4. **Email Not Sending**
   - Use Gmail App Password, not regular password
   - Check firewall/antivirus settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@petservices.com

## Acknowledgments

- Firebase for authentication and database
- Razorpay for payment processing
- All the amazing open-source libraries used in this project
# pet-care
