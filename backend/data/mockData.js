/**
 * Mock Database for Hayloft Woodshed API
 * This file contains mock data that simulates what would be stored in a database.
 */

// Categories
const categories = [
  {
    id: 'woodwork',
    name: 'Woodwork Collection',
    description: 'Handcrafted wooden masterpieces, each telling a unique story through grain and form.'
  },
  {
    id: 'paintings',
    name: 'Paintings Collection',
    description: 'Original art pieces showcasing various techniques and subjects.'
  },
  {
    id: 'knits',
    name: 'Knitted Items Collection',
    description: 'Handmade knitted pieces crafted with care and attention to detail.'
  }
];

// Products
const products = [
  // Woodwork products
  {
    id: 'walnut-dining-table',
    name: 'Walnut Dining Table',
    path: './walnut-dining-table.html',
    thumbnail: '/images/products/woodwork/walnut-dining-table-thumb.jpg',
    images: [
      '/images/products/woodwork/walnut-dining-table-1.jpg',
      '/images/products/woodwork/walnut-dining-table-2.jpg'
    ],
    price: 2400.00,
    status: 'available',
    featured: true,
    date: '2025-04-15',
    category: 'woodwork',
    description: 'Hand-crafted walnut dining table with natural edge. This beautiful piece features a bookmatched walnut slab with stunning grain patterns.',
    dimensions: '72" x 36" x 30"',
    materials: 'Black Walnut, Danish Oil Finish',
    attributes: {
      woodType: 'Black Walnut',
      finishType: 'Danish Oil'
    }
  },
  {
    id: 'maple-jewelry-box',
    name: 'Maple Jewelry Box',
    path: './maple-jewelry-box.html',
    thumbnail: '/images/products/woodwork/maple-jewelry-box-thumb.jpg',
    images: [
      '/images/products/woodwork/maple-jewelry-box-1.jpg',
      '/images/products/woodwork/maple-jewelry-box-2.jpg'
    ],
    price: 650.00,
    status: 'bidding',
    featured: true,
    date: '2025-05-01',
    category: 'woodwork',
    description: 'Elegantly crafted maple jewelry box with detailed inlay work and multiple compartments for organizing your precious items.',
    dimensions: '12" x 8" x 6"',
    materials: 'Maple, Cherry, Brass hardware',
    attributes: {
      woodType: 'Maple',
      finishType: 'Hand-rubbed Varnish'
    }
  },
  {
    id: 'oak-bookshelf',
    name: 'Oak Bookshelf',
    path: './oak-bookshelf.html',
    thumbnail: '/images/products/woodwork/oak-bookshelf-thumb.jpg',
    images: [
      '/images/products/woodwork/oak-bookshelf-1.jpg',
      '/images/products/woodwork/oak-bookshelf-2.jpg'
    ],
    price: 1800.00,
    status: 'available',
    featured: false,
    date: '2025-03-22',
    category: 'woodwork',
    description: 'Sturdy oak bookshelf with five adjustable shelves. Perfect for displaying your favorite books and collectibles.',
    dimensions: '36" x 12" x 72"',
    materials: 'Red Oak, Polyurethane Finish',
    attributes: {
      woodType: 'Red Oak',
      finishType: 'Semi-gloss Polyurethane'
    }
  },
  
  // Paintings products
  {
    id: 'mountain-sunset',
    name: 'Mountain Sunset',
    path: './mountain-sunset.html',
    thumbnail: '/images/products/paintings/mountain-sunset-thumb.jpg',
    images: [
      '/images/products/paintings/mountain-sunset-1.jpg',
      '/images/products/paintings/mountain-sunset-2.jpg'
    ],
    price: 850.00,
    status: 'available',
    featured: true,
    date: '2025-04-20',
    category: 'paintings',
    description: 'This vibrant painting captures the breathtaking colors of a mountain sunset, with gold and purple hues illuminating the peaks.',
    dimensions: '24" x 36"',
    materials: 'Acrylic on canvas',
    attributes: {
      medium: 'Acrylic',
      canvasType: 'Stretched canvas'
    }
  },
  {
    id: 'abstract-emotions',
    name: 'Abstract Emotions',
    path: './abstract-emotions.html',
    thumbnail: '/images/products/paintings/abstract-emotions-thumb.jpg',
    images: [
      '/images/products/paintings/abstract-emotions-1.jpg',
      '/images/products/paintings/abstract-emotions-2.jpg'
    ],
    price: 1200.00,
    status: 'bidding',
    featured: true,
    date: '2025-05-10',
    category: 'paintings',
    description: 'An abstract exploration of human emotions through bold colors and dynamic brush strokes.',
    dimensions: '30" x 40"',
    materials: 'Oil on canvas',
    attributes: {
      medium: 'Oil',
      canvasType: 'Gallery-wrapped canvas'
    }
  },
  {
    id: 'forest-path',
    name: 'Forest Path',
    path: './forest-path.html',
    thumbnail: '/images/products/paintings/forest-path-thumb.jpg',
    images: [
      '/images/products/paintings/forest-path-1.jpg',
      '/images/products/paintings/forest-path-2.jpg'
    ],
    price: 750.00,
    status: 'sold',
    featured: false,
    date: '2025-03-15',
    category: 'paintings',
    description: 'A serene forest path dappled with sunlight filtering through the leaves overhead.',
    dimensions: '18" x 24"',
    materials: 'Watercolor on paper',
    attributes: {
      medium: 'Watercolor',
      canvasType: 'Cold-pressed watercolor paper'
    }
  },
  
  // Knits products
  {
    id: 'winter-scarf',
    name: 'Hand-Knitted Winter Scarf',
    path: './winter-scarf.html',
    thumbnail: '/images/products/knits/winter-scarf-thumb.jpg',
    images: [
      '/images/products/knits/winter-scarf-1.jpg',
      '/images/products/knits/winter-scarf-2.jpg'
    ],
    price: 120.00,
    status: 'available',
    featured: true,
    date: '2025-05-05',
    category: 'knits',
    description: 'This luxuriously soft wool scarf will keep you warm and stylish through the coldest winter days.',
    dimensions: '72" x 8"',
    materials: 'Merino wool blend',
    attributes: {
      complexityLevel: 'Intermediate',
      includedComponents: 'Scarf only'
    }
  },
  {
    id: 'wool-sweater',
    name: 'Merino Wool Sweater',
    path: './wool-sweater.html',
    thumbnail: '/images/products/knits/wool-sweater-thumb.jpg',
    images: [
      '/images/products/knits/wool-sweater-1.jpg',
      '/images/products/knits/wool-sweater-2.jpg'
    ],
    price: 350.00,
    status: 'bidding',
    featured: true,
    date: '2025-04-28',
    category: 'knits',
    description: 'A classic cable knit sweater made from the finest merino wool. Perfect for layering during chilly evenings.',
    dimensions: 'Size M (see measurements in details)',
    materials: '100% Merino wool',
    attributes: {
      complexityLevel: 'Advanced',
      includedComponents: 'Sweater with care instructions'
    }
  },
  {
    id: 'baby-blanket',
    name: 'Baby Blanket',
    path: './baby-blanket.html',
    thumbnail: '/images/products/knits/baby-blanket-thumb.jpg',
    images: [
      '/images/products/knits/baby-blanket-1.jpg',
      '/images/products/knits/baby-blanket-2.jpg'
    ],
    price: 180.00,
    status: 'available',
    featured: false,
    date: '2025-03-10',
    category: 'knits',
    description: 'A soft, hypoallergenic baby blanket in a gentle pattern that will keep your little one cozy and comfortable.',
    dimensions: '36" x 36"',
    materials: 'Hypoallergenic acrylic yarn',
    attributes: {
      complexityLevel: 'Intermediate',
      includedComponents: 'Blanket with gift box'
    }
  }
];

module.exports = {
  categories,
  products
};
