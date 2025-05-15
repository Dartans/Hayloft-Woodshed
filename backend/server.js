/**
 * Hayloft Woodshed API Server
 * This is a simple Express server that serves as the backend API for the Hayloft Woodshed website.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database - this would be replaced with a real database in production
const mockDatabase = require('./data/mockData');

// API Routes

/**
 * Get all products or filter by category, featured status, etc.
 */
app.get('/api/products', (req, res) => {
  try {
    const { 
      category, 
      featured, 
      status, 
      sort = 'newest', 
      limit = 100, 
      offset = 0 
    } = req.query;
    
    // Start with all products
    let products = [...mockDatabase.products];
    
    // Apply category filter if specified
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
    // Apply featured filter if specified
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      products = products.filter(product => product.featured === isFeatured);
    }
    
    // Apply status filter if specified
    if (status) {
      products = products.filter(product => product.status === status);
    }
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        products.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Default to newest
        products.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      count: paginatedProducts.length,
      total: products.length,
      products: paginatedProducts
    });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred processing your request'
      }
    });
  }
});

/**
 * Get a single product by ID
 */
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = mockDatabase.products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID "${id}" not found`
        }
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error in GET /api/products/:id:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred processing your request'
      }
    });
  }
});

/**
 * Get featured products
 */
app.get('/api/products/featured', (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    // Filter featured products
    let featuredProducts = mockDatabase.products.filter(product => product.featured);
    
    // Apply category filter if specified
    if (category) {
      featuredProducts = featuredProducts.filter(product => product.category === category);
    }
    
    // Sort by newest first
    featuredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply limit
    featuredProducts = featuredProducts.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      count: featuredProducts.length,
      products: featuredProducts
    });
  } catch (error) {
    console.error('Error in GET /api/products/featured:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred processing your request'
      }
    });
  }
});

/**
 * Get all categories
 */
app.get('/api/categories', (req, res) => {
  try {
    res.json({
      success: true,
      categories: mockDatabase.categories
    });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred processing your request'
      }
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
