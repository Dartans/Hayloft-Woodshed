# Dynamic Catalog Implementation

## Overview

The Hayloft Woodshed website has been updated to use a dynamic product catalog system powered by a RESTful API. This document explains the changes made and how to run the system.

## Changes Made

1. Created API requirements document (`api_requirements.md`) outlining the API endpoints, request parameters, and response formats
2. Implemented a JavaScript API client (`frontend/js/product-api.js`) that handles communication with the API
3. Updated all catalog pages to fetch product data from the API:
   - `frontend/pages/products/woodwork/woodwork-catalog.html`
   - `frontend/pages/products/paintings/paintings-catalog.html`
   - `frontend/pages/products/knits/knits-catalog.html`
4. Implemented loading, error, and "no products" states in the UI
5. Created a mock backend implementation using Express.js to serve the API
6. Added styles to handle the dynamic loading states

## Running the System

### Step 1: Start the Backend API Server

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The API will be running at http://localhost:3000/api

### Step 2: Open the Frontend

The frontend can be opened directly in a web browser as static HTML files. You can use any web server to serve the frontend files, or open them directly from the filesystem.

## API Endpoints

The following API endpoints have been implemented:

- `GET /api/products` - Get all products with various filtering options
- `GET /api/products/:id` - Get a specific product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/categories` - Get all product categories

## Future Improvements

1. Add authentication for admin users to manage products
2. Implement real database persistence instead of mock data
3. Add image upload functionality for product images
4. Implement caching to improve performance
5. Create a proper build system for frontend assets
