# Firestore Database Schema

## Collections Overview

### 1. users
User profile and authentication data

```javascript
{
  uid: string,                    // Firebase Auth UID
  phoneNumber: string,            // Phone number
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp,
  role: string,                   // 'user' | 'admin'
  profile: {
    name: string,
    email: string,
    address: string,
    pets: [
      {
        id: string,
        name: string,
        type: string,             // 'dog' | 'cat' | 'bird' | etc.
        breed: string,
        age: number,
        weight: number,
        gender: string,
        medicalHistory: string,
        createdAt: timestamp
      }
    ]
  }
}
```

### 2. services
Service offerings (medical, grooming, veterinary, daycare, training)

```javascript
{
  name: string,
  description: string,
  category: string,               // 'medical' | 'grooming' | 'veterinary' | 'daycare' | 'training'
  type: string,                   // 'package' | 'single'
  price: number,
  duration: number,               // in minutes
  features: array,
  imageUrl: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. appointments
Medical service appointments

```javascript
{
  userId: string,
  serviceId: string,
  serviceType: string,
  petId: string,
  petName: string,
  date: string,                   // YYYY-MM-DD
  time: string,                   // HH:MM
  notes: string,
  status: string,                 // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: string,          // 'pending' | 'completed' | 'failed'
  paymentOrderId: string,
  paymentId: string,
  adminNotes: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  cancelledAt: timestamp
}
```

### 4. products
E-commerce products (food, toys, accessories, medicine)

```javascript
{
  name: string,
  description: string,
  category: string,               // 'food' | 'toys' | 'accessories' | 'medicine'
  price: number,
  discountPrice: number,
  stock: number,
  imageUrls: array,
  brand: string,
  petType: array,                 // ['dog', 'cat', etc.]
  rating: number,
  reviews: [
    {
      userId: string,
      userName: string,
      rating: number,
      comment: string,
      createdAt: timestamp
    }
  ],
  specifications: object,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. orders
E-commerce orders

```javascript
{
  userId: string,
  items: [
    {
      productId: string,
      name: string,
      price: number,
      quantity: number,
      imageUrl: string
    }
  ],
  shippingAddress: {
    name: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    pincode: string,
    landmark: string
  },
  totalAmount: number,
  paymentMethod: string,          // 'razorpay' | 'cod'
  paymentStatus: string,          // 'pending' | 'completed' | 'failed'
  paymentId: string,
  paymentDetails: object,
  orderStatus: string,            // 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  cancelledAt: timestamp
}
```

### 6. articles
Consultant articles (health tips, grooming advice, training guidance, seasonal care)

```javascript
{
  title: string,
  slug: string,
  content: string,                // HTML or Markdown
  excerpt: string,
  category: string,               // 'health-tips' | 'grooming' | 'training' | 'seasonal-care' | 'nutrition' | 'adoption'
  author: string,
  imageUrl: string,
  featured: boolean,
  views: number,
  tags: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7. consultations
Consultation requests from users

```javascript
{
  userId: string,
  petId: string,
  petName: string,
  consultationType: string,       // 'adoption' | 'health' | 'behavior' | 'nutrition'
  description: string,
  status: string,                 // 'pending' | 'scheduled' | 'completed' | 'cancelled'
  response: string,
  scheduledDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 8. bookings
Service bookings (grooming, daycare, training)

```javascript
{
  userId: string,
  serviceType: string,            // 'grooming' | 'daycare' | 'training'
  serviceId: string,
  petId: string,
  petName: string,
  date: string,                   // YYYY-MM-DD
  time: string,                   // HH:MM
  duration: number,               // in hours
  specialRequests: string,
  status: string,                 // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  cancelledAt: timestamp
}
```

### 9. vaccinations
Pet vaccination records

```javascript
{
  userId: string,
  petId: string,
  petName: string,
  vaccineName: string,
  vaccineType: string,
  vaccinationDate: string,        // YYYY-MM-DD
  nextDueDate: string,            // YYYY-MM-DD
  veterinarian: string,
  clinic: string,
  batchNumber: string,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 10. contacts
Contact form submissions

```javascript
{
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  status: string,                 // 'new' | 'in-progress' | 'resolved'
  response: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Indexes to Create in Firestore

For optimal query performance, create these indexes:

1. **appointments**
   - userId (Ascending) + createdAt (Descending)
   - status (Ascending) + date (Ascending)
   - date (Ascending) + status (Ascending)

2. **orders**
   - userId (Ascending) + createdAt (Descending)
   - orderStatus (Ascending) + createdAt (Descending)
   - paymentStatus (Ascending) + createdAt (Descending)

3. **products**
   - category (Ascending) + stock (Ascending)
   - category (Ascending) + rating (Descending)

4. **bookings**
   - userId (Ascending) + createdAt (Descending)
   - date (Ascending) + status (Ascending)
   - serviceType (Ascending) + date (Ascending)

5. **vaccinations**
   - userId (Ascending) + vaccinationDate (Descending)
   - userId (Ascending) + nextDueDate (Ascending)

6. **articles**
   - category (Ascending) + createdAt (Descending)
   - featured (Ascending) + createdAt (Descending)

7. **consultations**
   - userId (Ascending) + createdAt (Descending)
   - status (Ascending) + createdAt (Descending)

## Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId) || isAdmin();
    }

    // Services collection
    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Articles collection
    match /articles/{articleId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow delete: if isAdmin();
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow delete: if isAdmin();
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow delete: if isAdmin();
    }

    // Vaccinations collection
    match /vaccinations/{vaccinationId} {
      allow read: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow delete: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
    }

    // Consultations collection
    match /consultations/{consultationId} {
      allow read: if isSignedIn() && (isOwner(resource.data.userId) || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Contacts collection
    match /contacts/{contactId} {
      allow read: if isAdmin();
      allow create: if true;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```
