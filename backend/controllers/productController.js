import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper function to upload image to cloudinary via memory stream
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// @desc    Get all products (with pagination & search)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    
    // Search keyword (checks both title and description)
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    // Category filter
    const categoryFilter = req.query.category && req.query.category !== 'ALL CATEGORIES'
      ? { category: req.query.category }
      : {};

    // Location filter
    const locationFilter = req.query.location
      ? { location: { $regex: req.query.location, $options: 'i' } }
      : {};

    // Price range filters
    const priceFilter = {};
    if (req.query.minPrice) {
      priceFilter.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      priceFilter.$lte = Number(req.query.maxPrice);
    }
    const combinedPriceFilter = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    // Combine filters
    const filter = { ...keyword, ...categoryFilter, ...locationFilter, ...combinedPriceFilter };

    // Dynamic sorting
    let sortOption = { createdAt: -1 }; // Default newest
    if (req.query.sort === 'priceAsc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'priceDesc') {
      sortOption = { price: -1 };
    }

    const count = await Product.countDocuments(filter);
    
    const products = await Product.find(filter)
      .populate('seller', 'name profileImage role')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name email profileImage'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res, next) => {
  try {
    let imageUrls = [];

    // Check if files exist
    if (req.files && req.files.length > 0) {
      const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                     !process.env.CLOUDINARY_CLOUD_NAME.includes('your_') &&
                                     process.env.CLOUDINARY_API_KEY && 
                                     !process.env.CLOUDINARY_API_KEY.includes('your_');

      for (const file of req.files) {
        if (!isCloudinaryConfigured) {
          console.warn('[WARNING] Cloudinary is not configured. Using placeholder image.');
          imageUrls.push('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
          continue;
        }

        try {
          // Upload each file to Cloudinary
          const result = await new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              { folder: 'olx-clone/products' },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('[ERROR] Cloudinary upload failed:', uploadError.message);
          console.warn('Falling back to placeholder image.');
          imageUrls.push('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
        }
      }
    }

    const { title, description, price, category, location } = req.body;

    const product = new Product({
      title,
      description,
      price,
      category,
      location,
      images: imageUrls,
      seller: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, location } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is the seller or an admin
      if (
        product.seller.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        res.status(401);
        throw new Error('User not authorized to update this product');
      }

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.location = location || product.location;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is the seller or an admin
      if (
        product.seller.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        res.status(401);
        throw new Error('User not authorized to delete this product');
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
