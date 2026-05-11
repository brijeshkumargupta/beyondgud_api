const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondgud');

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const sampleProducts = [
      {
        name: 'Vanilla Lip Balm',
        description: 'Smooth and hydrating vanilla lip balm.',
        price: 189,
        originalPrice: 399,
        imageUrl: 'https://via.placeholder.com/150',
        category: 'Lip Care',
        stock: 50,
      },
      {
        name: 'Handmade Rose Soap',
        description: 'Natural handmade soap with rose extracts.',
        price: 250,
        originalPrice: 400,
        imageUrl: 'https://via.placeholder.com/150',
        category: 'Soaps',
        stock: 30,
      },
      {
        name: 'Hair Fall Control Oil',
        description: 'Effective hair oil for reducing hair fall.',
        price: 499,
        originalPrice: 799,
        imageUrl: 'https://via.placeholder.com/150',
        category: 'Hair Care',
        stock: 20,
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
