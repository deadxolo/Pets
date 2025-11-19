import { db } from '../config/firebase.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, inStock, minPrice, maxPrice, search } = req.query;
    let productsRef = db.collection('products');

    if (category) {
      productsRef = productsRef.where('category', '==', category);
    }
    if (inStock === 'true') {
      productsRef = productsRef.where('stock', '>', 0);
    }

    const snapshot = await productsRef.get();
    let products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Filter by price range
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({ products, total: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ product: { id: productDoc.id, ...productDoc.data() } });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stock: req.body.stock || 0,
      rating: 0,
      reviews: []
    };

    const docRef = await db.collection('products').add(productData);

    res.status(201).json({
      message: 'Product created successfully',
      product: { id: docRef.id, ...productData }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    delete updates.createdAt;
    delete updates.rating;
    delete updates.reviews;

    await db.collection('products').doc(id).update(updates);

    const updatedDoc = await db.collection('products').doc(id).get();
    res.status(200).json({
      message: 'Product updated successfully',
      product: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).delete();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
};

// Add product review
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const { rating, comment } = req.body;

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const review = {
      userId: uid,
      userName: userData.profile?.name || 'Anonymous',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productDoc.data();
    const reviews = product.reviews || [];
    reviews.push(review);

    // Calculate new average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    await productRef.update({
      reviews,
      rating: parseFloat(avgRating.toFixed(1)),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review', message: error.message });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'food', name: 'Pet Food', icon: '🍖' },
      { id: 'toys', name: 'Toys', icon: '🎾' },
      { id: 'accessories', name: 'Accessories', icon: '🎀' },
      { id: 'medicine', name: 'Medicine', icon: '💊' }
    ];

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
};
