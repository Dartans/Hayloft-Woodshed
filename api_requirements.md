# Hayloft Woodshed - API Requirements

## Overview
This document outlines the API requirements for the Hayloft Woodshed website. The goal is to transform the static product catalogs into dynamic pages populated with data from API endpoints. The API will return data in JSON format that will be consumed by the frontend to display products in the various catalog pages.

## API Endpoints

### 1. Product Catalog Endpoints

#### GET /api/products
- **Description**: Retrieves a list of all products or filtered by category
- **Query Parameters**:
  - `category` (optional): Filter products by category (`woodwork`, `paintings`, `knits`)
  - `featured` (optional): Filter products by featured status (true/false)
  - `status` (optional): Filter products by status (`available`, `sold`, `bidding`)
  - `sort` (optional): Sort products by (`newest`, `price-high`, `price-low`, `name`)
  - `limit` (optional): Limit the number of products returned
  - `offset` (optional): Pagination offset
- **Response Format**:
```json
{
  "success": true,
  "count": 10,
  "total": 24,
  "products": [
    {
      "id": "walnut-dining-table",
      "name": "Walnut Dining Table",
      "path": "./walnut-dining-table.html",
      "thumbnail": "/images/products/woodwork/walnut-dining-table-thumb.jpg",
      "price": 2400.00,
      "status": "available",
      "featured": true,
      "date": "2025-04-15",
      "category": "woodwork"
    },
    // More products...
  ]
}
```

#### GET /api/products/{id}
- **Description**: Retrieves detailed information about a specific product
- **Parameters**:
  - `id`: The unique identifier of the product
- **Response Format**:
```json
{
  "success": true,
  "product": {
    "id": "walnut-dining-table",
    "name": "Walnut Dining Table",
    "path": "./walnut-dining-table.html",
    "thumbnail": "/images/products/woodwork/walnut-dining-table-thumb.jpg",
    "images": [
      "/images/products/woodwork/walnut-dining-table-1.jpg",
      "/images/products/woodwork/walnut-dining-table-2.jpg"
    ],
    "price": 2400.00,
    "status": "available",
    "featured": true,
    "date": "2025-04-15",
    "category": "woodwork",
    "description": "Hand-crafted walnut dining table with natural edge...",
    "dimensions": "72\" x 36\" x 30\"",
    "materials": "Black Walnut, Danish Oil Finish",
    "attributes": {
      "woodType": "Black Walnut",
      "finishType": "Danish Oil"
    }
  }
}
```

#### GET /api/categories
- **Description**: Retrieves a list of all product categories
- **Response Format**:
```json
{
  "success": true,
  "categories": [
    {
      "id": "woodwork",
      "name": "Woodwork Collection",
      "description": "Handcrafted wooden masterpieces, each telling a unique story through grain and form."
    },
    {
      "id": "paintings",
      "name": "Paintings Collection",
      "description": "Original art pieces showcasing various techniques and subjects."
    },
    {
      "id": "knits",
      "name": "Knitted Items Collection",
      "description": "Handmade knitted pieces crafted with care and attention to detail."
    }
  ]
}
```

#### GET /api/products/featured
- **Description**: Retrieves featured products across all categories
- **Query Parameters**:
  - `category` (optional): Filter featured products by category
  - `limit` (optional): Limit the number of featured products returned
- **Response Format**: Same as `/api/products` endpoint, filtered to featured items

## Authentication

### POST /api/auth/login
- **Description**: Authenticates a user and returns a token
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response Format**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

## Error Handling
All API endpoints should follow a consistent error handling format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## API Implementation Notes
- API must implement proper CORS headers to allow requests from the frontend domain
- All responses should use the standard HTTP status codes (200 for success, 400 for bad request, 404 for not found, etc.)
- JSON responses should follow the formats specified above
- API should be versioned (e.g., `/api/v1/products`) to support future updates
