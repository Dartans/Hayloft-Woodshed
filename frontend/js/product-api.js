/**
 * Product API Handler for Hayloft Woodshed
 * This file contains common functions for interacting with the product API
 */

// API Base URL - Change this to match your actual API endpoint
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetches products from the API based on provided filters
 * @param {Object} options - Filter and sort options
 * @param {String} options.category - Product category (woodwork, paintings, knits)
 * @param {Boolean} options.featured - Featured status filter
 * @param {String} options.status - Status filter (available, sold, bidding)
 * @param {String} options.sort - Sort method (newest, price-high, price-low, name)
 * @param {Number} options.limit - Limit number of products
 * @param {Number} options.offset - Pagination offset
 * @returns {Promise<Object>} - Promise resolving to product data
 */
async function fetchProducts(options = {}) {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (options.category) queryParams.append('category', options.category);
        if (options.featured !== undefined) queryParams.append('featured', options.featured);
        if (options.status) queryParams.append('status', options.status);
        if (options.sort) queryParams.append('sort', options.sort);
        if (options.limit) queryParams.append('limit', options.limit);
        if (options.offset) queryParams.append('offset', options.offset);
        
        // Make the request
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await fetch(`${API_BASE_URL}/products${queryString}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return a fallback structure to prevent crashes
        return {
            success: false,
            error: {
                message: error.message || 'Failed to fetch products',
                code: 'API_FETCH_ERROR'
            },
            products: []
        };
    }
}

/**
 * Fetches a single product by ID
 * @param {String} productId - The product ID to fetch
 * @returns {Promise<Object>} - Promise resolving to product data
 */
async function fetchProductById(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return {
            success: false,
            error: {
                message: error.message || 'Failed to fetch product',
                code: 'API_FETCH_ERROR'
            },
            product: null
        };
    }
}

/**
 * Fetches categories from the API
 * @returns {Promise<Object>} - Promise resolving to categories data
 */
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            success: false,
            error: {
                message: error.message || 'Failed to fetch categories',
                code: 'API_FETCH_ERROR'
            },
            categories: []
        };
    }
}

/**
 * Fetches featured products across all categories or by specific category
 * @param {Object} options - Options for featured products
 * @param {String} options.category - Optional category filter
 * @param {Number} options.limit - Optional limit on number of products
 * @returns {Promise<Object>} - Promise resolving to featured products data
 */
async function fetchFeaturedProducts(options = {}) {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (options.category) queryParams.append('category', options.category);
        if (options.limit) queryParams.append('limit', options.limit);
        
        // Make the request
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await fetch(`${API_BASE_URL}/products/featured${queryString}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return {
            success: false,
            error: {
                message: error.message || 'Failed to fetch featured products',
                code: 'API_FETCH_ERROR'
            },
            products: []
        };
    }
}

// Export functions if using module system
// If your site doesn't use modules, these will be available globally
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        fetchProducts,
        fetchProductById,
        fetchCategories,
        fetchFeaturedProducts
    };
}
