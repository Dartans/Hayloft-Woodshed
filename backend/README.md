# Hayloft Woodshed API

This is the backend API server for the Hayloft Woodshed website. It provides RESTful endpoints for retrieving product and category data.

## Setup

1. Make sure you have Node.js installed (v14+ recommended)
2. Install dependencies:

```bash
npm install
```

## Running the Server

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when changes are detected.

### Production Mode

```bash
npm start
```

## API Endpoints

The API is available at `http://localhost:3000/api` by default.

### Products

- `GET /api/products` - Get all products with optional filters
  - Query parameters:
    - `category` - Filter by category (woodwork, paintings, knits)
    - `featured` - Filter by featured status (true/false)
    - `status` - Filter by status (available, sold, bidding)
    - `sort` - Sort by (newest, price-high, price-low, name)
    - `limit` - Limit number of products returned
    - `offset` - Pagination offset

- `GET /api/products/:id` - Get a specific product by ID

- `GET /api/products/featured` - Get featured products
  - Query parameters:
    - `category` - Filter featured products by category
    - `limit` - Limit number of products returned

### Categories

- `GET /api/categories` - Get all product categories

## Mock Data

Currently, the API uses mock data stored in `data/mockData.js`. In a production environment, this would be replaced with a database connection.

## CORS

CORS is enabled for all origins to facilitate development. In a production environment, this should be restricted to specific domains.
