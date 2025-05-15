# Hayloft Woodshed - Project Notes

*Last Updated: May 14, 2025*

## 1. Project Overview & Goals

### Overview
Hayloft Woodshed is a website for a multi-disciplinary artist to showcase and sell their handcrafted pieces. The platform features woodworking art, knitted items, and paintings. The platform will allow customers to browse the diverse collection, view details about each item, and make purchases or place bids on available works.

### Primary Goals
- Create a visually appealing showcase for diverse art pieces including woodwork, knits, and paintings
- Provide a seamless browsing experience for potential customers
- Enable direct purchase of available items
- Implement a bidding system for special or custom pieces
- Maintain a strictly HTML/CSS frontend with no client-side scripting
- Create a separate backend API to handle all dynamic functionality
- Support categorization of items by art type (woodworking, knitted items, paintings)

### Technical Constraints
- Frontend: HTML and CSS only (no JavaScript, PHP, or other client-side scripting)
- Backend: RESTful API (separate development) for dynamic content and functionality
- Clean separation between static frontend and dynamic backend

## 2. High-Level Architecture

The Hayloft Woodshed project follows a traditional client-server architecture with clear separation of concerns:

### Frontend Layer
- Static HTML/CSS website
- Organized by product categories (woodwork, knits, paintings)
- Form-based interactions for user input
- No client-side scripting

### Backend Layer
- RESTful API providing data and business logic (Planned: `backend/` directory is currently empty)
- Server-side rendering for dynamic content
- Database for product and user information storage
- Authentication and session management
- Order processing and bidding system

### Data Layer
- Persistent storage for products, users, orders, and bids
- Image storage and delivery system

### Integration Layer
- Payment processing gateway
- Email notification system (for order confirmations, bid updates)

## 3. Component Breakdown

### Frontend Components
- **Core Pages & Structure:**
  - `index.html`: Main landing page.
  - `frontend/pages/gallery.html`: Main gallery page for browsing all products.
- **Styling:**
  - `frontend/css/styles.css`: Main stylesheet for the website.
  - `frontend/css/gallery.css`: Styles specific to the gallery.
- **Product Category Pages & Templates:**
  - **Knits:**
    - `frontend/pages/products/knits/knits-catalog.html`: Catalog page for knitted products.
    - `frontend/pages/products/knits/product-template.html`: Template for individual knit product pages.
  - **Paintings:**
    - `frontend/pages/products/paintings/paintings-catalog.html`: Catalog page for paintings.
    - `frontend/pages/products/paintings/product-template.html`: Template for individual painting product pages.
  - **Woodwork:**
    - `frontend/pages/products/woodwork/woodwork-catalog.html`: Catalog page for woodwork products.
    - `frontend/pages/products/woodwork/product-template.html`: Template for individual woodwork product pages.
- **Shared Assets:**
  - `frontend/images/`: Directory for storing images.
- **Note:** The file `frontend/pages/product_management.md` appears to be documentation; its purpose and location should be clarified.

### Backend Components (Planned)
- **API Controllers**
  - Product management endpoints
  - User management endpoints
  - Order processing endpoints
  - Bidding system endpoints
  
- **Business Logic Services**
  - Product service
  - User authentication service
  - Order service
  - Bidding service
  
- **Data Access Layer**
  - Database repositories
  - Image storage management
  
- **Rendering Service**
  - HTML generation for dynamic content

## 4. Data Structures & Models

### Core Data Entities

#### Product
- ID: Unique identifier
- Type: (Woodwork, knit, Painting)
- Name: Product name
- Description: Detailed description
- Price: Current price
- Status: (Available, Sold, Under Bid, etc.)
- Images: Array of image URLs
- Dimensions: Physical dimensions (where applicable)
- Materials: Materials used
- CreationDate: When the item was made
- Category-specific attributes:
  - Woodwork: Wood type, finish type
  - knits: Complexity level, included components
  - Paintings: Medium, canvas type

#### User
- ID: Unique identifier
- Name: User's full name
- Email: Contact email
- Password: Encrypted password
- ShippingAddress: Default shipping address
- OrderHistory: References to past orders

#### Order
- ID: Unique identifier
- UserID: Reference to purchasing user
- Products: Array of product IDs and quantities
- Total: Order total amount
- Status: (Pending, Paid, Shipped, Delivered)
- ShippingDetails: Address and shipping method
- OrderDate: When the order was placed

#### Bid
- ID: Unique identifier
- ProductID: Reference to product
- UserID: Reference to bidding user
- Amount: Bid amount
- Timestamp: When the bid was placed
- Status: (Active, Accepted, Rejected)

## 5. Key Decisions Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| May 14, 2025 | Created project_notes.md | To maintain clear structure following the AI Project Structure Guide | N/A |
| May 14, 2025 | Decided on HTML/CSS only frontend | Client requirement; ensures maximum compatibility and simplicity | JavaScript-enhanced frontend |
| May 14, 2025 | Separate backend API development | To handle dynamic content while keeping the frontend static | Integrated approach |

## 6. Technology Stack

### Frontend
- HTML5
- CSS3 (may include frameworks like Bootstrap or custom CSS)

### Backend (planned)
- RESTful API (technology to be determined)
- Database system (to be determined)
- Payment processing integration (to be determined)

## 7. API Endpoints

Based on our frontend requirements, we've identified these key API endpoints:

### Product Management
- GET `/api/products` - Retrieve all products for gallery display
- GET `/api/products/{id}` - Get detailed information about a specific product
- GET `/api/categories` - Retrieve all product categories

### User Management
- POST `/api/users` - Register a new user
- GET `/api/users/{id}` - Retrieve user information

### Purchasing
- POST `/api/orders` - Create a new order
- GET `/api/orders/{id}` - Get order details

### Bidding System
- POST `/api/bids` - Place a bid on an item
- GET `/api/products/{id}/bids` - Get all bids for a product

*Full API details are tracked in api_requirements.md*

## 8. Workflow/Process Flow

### Basic User Flow (preliminary)
1. User visits the Hayloft Woodshed website
2. User browses gallery of available woodworking pieces
3. User selects an item to view detailed information
4. User either:
   - Makes a direct purchase of available items
   - Places a bid on special items
   - Contacts the artist for custom work
5. Backend API handles transaction processing and database updates

## 9. To-Do & Pending Questions
- Basic HTML structure for the website is partially implemented (see `frontend/` directory). Continue development.
- Design the CSS styling to showcase woodworking pieces effectively (initial CSS files `styles.css`, `gallery.css` exist).
- Define the necessary API endpoints for dynamic content (initial list in `api_requirements.md`).
- Determine how the frontend will handle API responses without JavaScript
- Decide on image handling and gallery presentation approach
- Plan the database schema for product inventory
- Define the bidding system mechanics
- Define the images storage and delivery strategy
- Plan for server-side rendering implementation
- Determine session management approach without client-side JavaScript
- **Implement backend API and services (currently `backend/` directory is empty).**
- **Clarify the purpose of `frontend/pages/product_management.md` and consider moving it to a dedicated documentation area if it's not a live frontend page.**