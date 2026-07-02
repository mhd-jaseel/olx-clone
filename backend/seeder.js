import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const dummyProducts = [
  {
    title: 'iPhone 14 Pro Max - 256GB Gold',
    description: 'Selling my iPhone 14 Pro Max in Gold color. 256GB storage, 92% battery health, completely scratchless and in pristine condition. Comes with original box and cable.',
    price: 85000,
    category: 'Mobile Phones',
    location: 'Mumbai, Maharashtra',
    images: ['https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800']
  },
  {
    title: 'Samsung Galaxy S23 Ultra Cream',
    description: 'Samsung Galaxy S23 Ultra, Cream color, 12GB RAM, 512GB Storage. 1 year old, works perfectly, tiny scratch on the side, overall 9/10 condition. S-Pen included.',
    price: 78000,
    category: 'Mobile Phones',
    location: 'Delhi, NCR',
    images: ['https://images.unsplash.com/photo-1678911820864-b2c93eebeb4b?w=800']
  },
  {
    title: 'Honda Civic 2020 Model Automatic',
    description: 'Honda Civic VTEC Turbo, 2020 model, automatic transmission. Driven only 45,000 km. Regularly serviced at authorized dealership. Excellent fuel economy, bumper-to-bumper original.',
    price: 1850000,
    category: 'Cars',
    location: 'Bangalore, Karnataka',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800']
  },
  {
    title: 'Toyota Corolla Altis 2018 White',
    description: 'Selling Toyota Corolla Altis 1.8G, 2018 model. Super white color, single owner, done 68,000 km. Very clean interior, brand new tires, zero insurance claims.',
    price: 1200000,
    category: 'Cars',
    location: 'Chennai, Tamil Nadu',
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800']
  },
  {
    title: 'Yamaha R15 V3 2021 Racing Blue',
    description: 'Yamaha R15 V3, 2021 model, Racing Blue. Driven 12,000 km. Well maintained, sporty look, no modifications, both keys and insurance valid. Selling due to relocation.',
    price: 140000,
    category: 'Motorcycles',
    location: 'Pune, Maharashtra',
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800']
  },
  {
    title: 'Royal Enfield Classic 350 Matte Black',
    description: 'Royal Enfield Classic 350cc, Matte Black, 2022 model. Single owner, 8,500 km driven. Fitted with dual-channel ABS, custom exhaust (original exhaust also available). Pristine condition.',
    price: 190000,
    category: 'Motorcycles',
    location: 'Kochi, Kerala',
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800']
  },
  {
    title: '3 BHK Luxury Apartment for Sale in Downtown',
    description: 'Spacious 3 BHK apartment in a premium gated society. 1800 sq ft, 24/7 security, swimming pool, gym, covered parking, and beautiful balcony view. Located close to malls and schools.',
    price: 8500000,
    category: 'Properties',
    location: 'Hyderabad, Telangana',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']
  },
  {
    title: 'Cozy Studio Apartment near Metro Station',
    description: 'Fully furnished studio apartment ideal for single professionals or couples. 450 sq ft, modular kitchen, air conditioning, 2-minute walk to the nearest metro station. High rental yield.',
    price: 3500000,
    category: 'Properties',
    location: 'Kolkata, West Bengal',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']
  },
  {
    title: 'MacBook Pro M1 2020 Space Gray',
    description: 'Apple MacBook Pro 13-inch, M1 Chip, 8GB RAM, 256GB SSD, Space Gray. Battery cycle count: 180, battery health: 89%. Includes original Apple USB-C charger. Working flawlessly.',
    price: 65000,
    category: 'Electronics',
    location: 'Noida, Uttar Pradesh',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']
  },
  {
    title: 'Sony WH-1000XM4 Noise Canceling Headphones',
    description: 'Sony WH-1000XM4 over-ear active noise-cancelling wireless headphones in black. Outstanding sound quality, 30 hours battery life, touch controls. Excellent condition, carrying case included.',
    price: 18000,
    category: 'Electronics',
    location: 'Gurgaon, Haryana',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']
  },
  {
    title: 'Modern L-Shaped 5 Seater Sofa Set',
    description: 'Selling a premium quality L-shaped fabric sofa set, grey color. 1.5 years old, extremely comfortable, no stains or damage. Fits perfectly in any living room. Price negotiable.',
    price: 25000,
    category: 'Furniture',
    location: 'Ahmedabad, Gujarat',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']
  },
  {
    title: 'Premium Leather Jacket for Men',
    description: 'Genuine sheepskin black leather jacket for men. Size: L, slim fit. Extremely warm and stylish, worn only twice. Selling because size doesn\'t fit me anymore.',
    price: 4500,
    category: 'Fashion',
    location: 'Chandigarh, Punjab',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800']
  },
  {
    title: 'Acoustic Guitar with Bag & Picks',
    description: 'Yamaha F310 Acoustic Guitar, Natural color. Great for beginners and intermediate players. Warm tone, well set up action. Includes a padded gig bag, tuner, and some picks.',
    price: 6000,
    category: 'Other',
    location: 'Jaipur, Rajasthan',
    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800']
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find or create default seller
    let seller = await User.findOne({ email: 'seller@olxclone.com' });
    if (!seller) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      seller = await User.create({
        name: 'John Doe (Default Seller)',
        email: 'seller@olxclone.com',
        password: hashedPassword,
        role: 'user',
        profileImage: 'default.jpg'
      });
      console.log('Created default seller user.');
    } else {
      console.log('Default seller user found.');
    }

    // Attach seller ID to products
    const productsToSeed = dummyProducts.map(p => ({
      ...p,
      seller: seller._id
    }));

    // Optionally clear existing products to start fresh
    // await Product.deleteMany({});
    // console.log('Cleared existing products.');

    await Product.insertMany(productsToSeed);
    console.log('Successfully seeded dummy products!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
