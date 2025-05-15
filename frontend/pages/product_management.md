# Product Management - Hayloft Woodshed

This document provides instructions for managing products on the Hayloft Woodshed website.

## Catalog Files

The website uses catalog files to track products in each category. These files are:

- `/pages/products/woodwork/woodwork-catalog.html`
- `/pages/products/knits/knits-catalog.html`
- `/pages/products/paintings/paintings-catalog.html`

These catalog files serve as the source of truth for what products should appear on the website. When adding or removing products, these catalog files must be updated.

## Adding a New Product

1. Create a new HTML file for the product in the appropriate category folder (woodwork, knits, or paintings)
2. Use the `product-template.html` as a starting point and customize it for your new product
3. Add an entry for the product in the appropriate catalog file (woodwork-catalog.html, knits-catalog.html, or paintings-catalog.html)
4. Place the product images in the corresponding images directory

### Product Entry Format

Each product in the catalog file should follow this format:

```html
<product>
    <id>unique-product-id</id>
    <n>Product Name</n>
    <path>./product-name.html</path>
    <thumbnail>/images/products/category/product-thumbnail.jpg</thumbnail>
    <price>999.00</price>
    <status>available</status> <!-- available, sold, bidding -->
    <featured>true</featured> <!-- true or false -->
    <date>2025-05-01</date> <!-- creation/publishing date -->
</product>
```

Make sure to update all fields with the appropriate information for your product.

## Removing a Product

1. Delete the product's HTML file from the appropriate category folder
2. Remove the product entry from the appropriate catalog file
3. Optionally, archive the product images if they are no longer needed

## Setting Featured Products

Products marked with `<featured>true</featured>` will appear on the homepage and in featured sections. To feature a product:

1. Open the appropriate catalog file
2. Find the product entry you want to feature
3. Change `<featured>false</featured>` to `<featured>true</featured>`

## Product Status

Products can have one of three statuses:

- `available`: The product is available for purchase
- `sold`: The product has been sold
- `bidding`: The product is available for bidding

Update the status in the catalog file as needed.

## Category Pages

The category pages (`woodwork.html`, `knits.html`, and `paintings.html`) pull data from the catalog files to display products. When you update a catalog file, the corresponding category page will automatically reflect those changes.

## API Integration

When a customer wants to purchase a product or place a bid, the frontend will send a request to the backend API. The API endpoints required for these actions are defined in the `api_requirements.md` file at the root of the project.