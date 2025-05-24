/**
 * Hayloft Woodshed API Server
 * This is a simple Express server that serves as the backend API for the Hayloft Woodshed website.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.js');
const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // Increased limit for base64 encoded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to save base64 image to file
function saveBase64Image(base64Data, filePath) {
  return new Promise((resolve, reject) => {
    // Extract the base64 data (remove the data:image/jpeg;base64, part)
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return reject(new Error('Invalid base64 string'));
    }
    
    const imageData = Buffer.from(matches[2], 'base64');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    ensureDirectoryExists(dir);
    
    // Write file
    fs.writeFile(filePath, imageData, (err) => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
}

// Helper function to convert relative URLs to absolute URLs
function getAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return relativeUrl;
  // If already absolute URL, return as-is
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  // Ensure relativeUrl starts with a forward slash
  const normalizedRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
  return `${API_URL}${normalizedRelativeUrl}`;
}

// API Routes

/**
 * Get all products or filter by category, featured status, etc.
 */
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      status, 
      sort = 'newest', 
      limit = 100, 
      offset = 0 
    } = req.query;
    
    // Build the SQL query with filters
    let sqlParams = [];
    let sqlQuery = `
      SELECT 
        p.id, p.name, p.path, p.thumbnail, p.price, 
        p.status, p.featured, p.date, p.category, 
        p.description, p.dimensions, p.materials 
      FROM products p
      WHERE 1=1
    `;
    
    // Apply category filter if specified
    if (category) {
      sqlParams.push(category);
      sqlQuery += ` AND p.category = $${sqlParams.length}`;
    }
    
    // Apply featured filter if specified
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      sqlParams.push(isFeatured);
      sqlQuery += ` AND p.featured = $${sqlParams.length}`;
    }
    
    // Apply status filter if specified
    if (status) {
      sqlParams.push(status);
      sqlQuery += ` AND p.status = $${sqlParams.length}`;
    }
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        sqlQuery += ' ORDER BY p.date DESC';
        break;
      case 'price-high':
        sqlQuery += ' ORDER BY p.price DESC';
        break;
      case 'price-low':
        sqlQuery += ' ORDER BY p.price ASC';
        break;
      case 'name':
        sqlQuery += ' ORDER BY p.name ASC';
        break;
      default:
        sqlQuery += ' ORDER BY p.date DESC';
    }
    
    // Get total count before applying pagination
    const countQuery = `SELECT COUNT(*) FROM (${sqlQuery}) AS filtered_products`;
    const countResult = await db.query(countQuery, sqlParams);
    const total = parseInt(countResult.rows[0].count);
    
    // Apply pagination
    sqlParams.push(parseInt(limit), parseInt(offset));
    sqlQuery += ` LIMIT $${sqlParams.length - 1} OFFSET $${sqlParams.length}`;
    
    // Execute the final query
    const result = await db.query(sqlQuery, sqlParams);
    
    // Fetch images and attributes for each product
    const products = await Promise.all(result.rows.map(async (product) => {
      // Get product images
      const imagesQuery = 'SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY display_order';
      const imagesResult = await db.query(imagesQuery, [product.id]);
      product.images = imagesResult.rows.map(row => getAbsoluteUrl(row.image_url));
      
      // Convert thumbnail URL to absolute URL
      if (product.thumbnail) {
        product.thumbnail = getAbsoluteUrl(product.thumbnail);
      }
      
      // Get product attributes
      const attributesQuery = 'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = $1';
      const attributesResult = await db.query(attributesQuery, [product.id]);
      product.attributes = {};
      attributesResult.rows.forEach(row => {
        product.attributes[row.attribute_name] = row.attribute_value;
      });
      
      return product;
    }));
    
    res.json({
      success: true,
      count: products.length,
      total,
      products
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
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the product
    const productResult = await db.query(`
      SELECT 
        p.id, p.name, p.path, p.thumbnail, p.price, 
        p.status, p.featured, p.date, p.category, 
        p.description, p.dimensions, p.materials 
      FROM products p
      WHERE p.id = $1
    `, [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID "${id}" not found`
        }
      });
    }
    
    const product = productResult.rows[0];
    
    // Get product images
    const imagesResult = await db.query(
      'SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY display_order',
      [id]
    );
    product.images = imagesResult.rows.map(row => getAbsoluteUrl(row.image_url));
    
    // Convert thumbnail URL to absolute URL
    if (product.thumbnail) {
      product.thumbnail = getAbsoluteUrl(product.thumbnail);
    }
    
    // Get product attributes
    const attributesResult = await db.query(
      'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = $1',
      [id]
    );
    product.attributes = {};
    attributesResult.rows.forEach(row => {
      product.attributes[row.attribute_name] = row.attribute_value;
    });
    
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
// NOTE: This endpoint needs to be before the /api/products/:id route to avoid conflicts
app.get('/api/featured-products', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    // Build the SQL query with filters
    let sqlParams = [true]; // featured = true
    let sqlQuery = `
      SELECT 
        p.id, p.name, p.path, p.thumbnail, p.price, 
        p.status, p.featured, p.date, p.category, 
        p.description, p.dimensions, p.materials 
      FROM products p
      WHERE p.featured = $1
    `;
    
    // Apply category filter if specified
    if (category) {
      sqlParams.push(category);
      sqlQuery += ` AND p.category = $${sqlParams.length}`;
    }
    
    // Apply sorting and limit
    sqlParams.push(parseInt(limit));
    sqlQuery += ` ORDER BY p.date DESC LIMIT $${sqlParams.length}`;
    
    // Execute the query
    const result = await db.query(sqlQuery, sqlParams);
    
    // Fetch images and attributes for each product
    const products = await Promise.all(result.rows.map(async (product) => {
      // Get product images
      const imagesQuery = 'SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY display_order';
      const imagesResult = await db.query(imagesQuery, [product.id]);
      product.images = imagesResult.rows.map(row => getAbsoluteUrl(row.image_url));
      
      // Convert thumbnail URL to absolute URL
      if (product.thumbnail) {
        product.thumbnail = getAbsoluteUrl(product.thumbnail);
      }
      
      // Get product attributes
      const attributesQuery = 'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = $1';
      const attributesResult = await db.query(attributesQuery, [product.id]);
      product.attributes = {};
      attributesResult.rows.forEach(row => {
        product.attributes[row.attribute_name] = row.attribute_value;
      });
      
      return product;
    }));
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error in GET /api/featured-products:', error);
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
app.get('/api/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, description FROM categories');
    
    res.json({
      success: true,
      categories: result.rows
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

/**
 * Product Management Routes
 * These routes are used to add, update, or get products for management purposes
 */

/**
 * Add a new product or update an existing one
 */
app.post('/api/manage/products', async (req, res) => {
  try {
    let {
      id,
      name,
      path: productPath, // Renamed to avoid conflict with path module
      thumbnail,
      price,
      status,
      featured,
      date,
      category,
      description,
      dimensions,
      materials,
      attributes,
      images
    } = req.body;

    // Generate a UUID for the product if none is provided
    if (!id) {
      // Create a slug from the product name
      const slug = name.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/--+/g, '-')     // Replace multiple hyphens with a single one
        .substring(0, 20);        // Limit slug length to ensure total ID fits in 36 chars
        
      // Generate a short timestamp (last 6 digits)
      const shortTimestamp = (Date.now() % 1000000).toString();
        
      // Use the slug as the ID for better SEO and readability, but ensure total length <= 36
      id = `${category.substring(0, 8)}-${slug}-${shortTimestamp}`.substring(0, 36);
    }

    // Check if product with this ID already exists
    const existingProduct = await db.query('SELECT id FROM products WHERE id = $1', [id]);
    let result;

    // If product exists, update it
    if (existingProduct.rows.length > 0) {
      result = await db.query(`
        UPDATE products 
        SET name = $1, path = $2, thumbnail = $3, price = $4, status = $5, 
            featured = $6, date = $7, category = $8, description = $9, 
            dimensions = $10, materials = $11
        WHERE id = $12
        RETURNING id, name, path, thumbnail, price, status, featured, date, category, description, dimensions, materials
      `, [name, productPath, thumbnail, price, status, featured, date, category, description, dimensions, materials, id]);

      // Clear existing images and attributes to replace with new ones
      await db.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      await db.query('DELETE FROM product_attributes WHERE product_id = $1', [id]);
    } else {
      // If product doesn't exist, create a new one
      result = await db.query(`
        INSERT INTO products (id, name, path, thumbnail, price, status, featured, date, category, description, dimensions, materials)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, name, path, thumbnail, price, status, featured, date, category, description, dimensions, materials
      `, [id, name, productPath, thumbnail, price, status, featured, date, category, description, dimensions, materials]);
    }

    const product = result.rows[0];

    // Handle uploaded image files if present
    const uploadedImageFiles = req.body.uploadedImageFiles;
    
    // Create a directory for this product category if it doesn't exist
    const categoryDir = path.join(__dirname, 'uploads', category);
    ensureDirectoryExists(categoryDir);
    
    // Create a slug for the product name
    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
    
    // Add images for the product
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        // Save the image to the uploads directory
        let imageUrl = images[i];
        
        // Check if we have actual image data to save
        if (uploadedImageFiles && uploadedImageFiles[i] && uploadedImageFiles[i].dataUrl) {
          // Create the file path
          const filename = `${slug}-${i + 1}.jpg`;
          const filePath = path.join(categoryDir, filename);
          
          try {
            // Save the image data to file
            await saveBase64Image(uploadedImageFiles[i].dataUrl, filePath);
            
            // Update the image URL to point to the saved file (using relative path)
            imageUrl = `/uploads/${category}/${filename}`;
          } catch (err) {
            console.error('Error saving image:', err);
          }
        }
        
        // Insert the image URL into the database
        await db.query(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1, $2, $3)',
          [id, imageUrl, i]
        );
      }
      
      // Handle thumbnail separately
      if (thumbnail && uploadedImageFiles && uploadedImageFiles[0]) {
        const thumbFilename = `${slug}-thumb.jpg`;
        const thumbPath = path.join(categoryDir, thumbFilename);
        
        try {
          // Save the thumbnail image data
          await saveBase64Image(uploadedImageFiles[0].dataUrl, thumbPath);
          
          // Update the thumbnail URL in the database
          const thumbUrl = `/uploads/${category}/${thumbFilename}`;
          await db.query('UPDATE products SET thumbnail = $1 WHERE id = $2', [thumbUrl, id]);
        } catch (err) {
          console.error('Error saving thumbnail:', err);
        }
      }
    }

    // Add attributes for the product
    if (attributes && Object.keys(attributes).length > 0) {
      for (const [key, value] of Object.entries(attributes)) {
        await db.query(
          'INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES ($1, $2, $3)',
          [id, key, value]
        );
      }
    }

    res.json({
      success: true,
      message: existingProduct.rows.length > 0 ? 'Product updated successfully' : 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error in POST /api/manage/products:', error);
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
 * Get products for management (with pagination and filtering)
 */
app.get('/api/manage/products', async (req, res) => {
  try {
    const {
      category,
      featured,
      status,
      sort = 'newest',
      limit = 100,
      offset = 0
    } = req.query;

    // Build the SQL query with filters
    let sqlParams = [];
    let sqlQuery = `
      SELECT 
        p.id, p.name, p.path, p.thumbnail, p.price, 
        p.status, p.featured, p.date, p.category, 
        p.description, p.dimensions, p.materials
      FROM products p
      WHERE 1=1
    `;

    // Apply category filter if specified
    if (category) {
      sqlParams.push(category);
      sqlQuery += ` AND p.category = $${sqlParams.length}`;
    }

    // Apply featured filter if specified
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      sqlParams.push(isFeatured);
      sqlQuery += ` AND p.featured = $${sqlParams.length}`;
    }

    // Apply status filter if specified
    if (status) {
      sqlParams.push(status);
      sqlQuery += ` AND p.status = $${sqlParams.length}`;
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        sqlQuery += ' ORDER BY p.date DESC';
        break;
      case 'oldest':
        sqlQuery += ' ORDER BY p.date ASC';
        break;
      case 'price-high':
        sqlQuery += ' ORDER BY p.price DESC';
        break;
      case 'price-low':
        sqlQuery += ' ORDER BY p.price ASC';
        break;
      case 'name':
        sqlQuery += ' ORDER BY p.name ASC';
        break;
      default:
        sqlQuery += ' ORDER BY p.date DESC';
    }

    // Get total count before applying pagination
    const countQuery = `SELECT COUNT(*) FROM (${sqlQuery}) AS filtered_products`;
    const countResult = await db.query(countQuery, sqlParams);
    const total = parseInt(countResult.rows[0].count);

    // Apply pagination
    sqlParams.push(parseInt(limit), parseInt(offset));
    sqlQuery += ` LIMIT $${sqlParams.length - 1} OFFSET $${sqlParams.length}`;

    // Execute the final query
    const result = await db.query(sqlQuery, sqlParams);

    // Fetch images and attributes for each product
    const products = await Promise.all(result.rows.map(async (product) => {
      // Get product images
      const imagesQuery = 'SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY display_order';
      const imagesResult = await db.query(imagesQuery, [product.id]);
      product.images = imagesResult.rows.map(row => getAbsoluteUrl(row.image_url));
      
      // Convert thumbnail URL to absolute URL
      if (product.thumbnail) {
        product.thumbnail = getAbsoluteUrl(product.thumbnail);
      }

      // Get product attributes
      const attributesQuery = 'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = $1';
      const attributesResult = await db.query(attributesQuery, [product.id]);
      product.attributes = {};
      attributesResult.rows.forEach(row => {
        product.attributes[row.attribute_name] = row.attribute_value;
      });

      return product;
    }));

    res.json({
      success: true,
      count: products.length,
      total,
      products
    });
  } catch (error) {
    console.error('Error in GET /api/manage/products:', error);
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
 * Delete a product
 */
app.delete('/api/manage/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await db.query('SELECT id FROM products WHERE id = $1', [id]);
    
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID "${id}" not found`
        }
      });
    }
    
    // Delete related images and attributes first (foreign key constraints)
    await db.query('DELETE FROM product_images WHERE product_id = $1', [id]);
    await db.query('DELETE FROM product_attributes WHERE product_id = $1', [id]);
    
    // Delete the product
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/manage/products/:id:', error);
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
