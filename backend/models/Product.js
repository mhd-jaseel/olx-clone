import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Mobile Phones',
        'Cars',
        'Motorcycles',
        'Properties',
        'Electronics',
        'Furniture',
        'Fashion',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    images: [
      {
        type: String, // Array of image URLs (Cloudinary)
      },
    ],
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for search functionality
productSchema.index({ title: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
