const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*', // Allow all origins for now (or specify 'https://aslam899-atk.github.io')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Art Void Server is Running!');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/art-void';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- SCHEMAS & MODELS ---
const schemaOptions = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

// 1. Product (Shop)
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String, // Cloudinary URL
    description: String,
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Product = mongoose.model('Product', productSchema);

// 2. Gallery
const gallerySchema = new mongoose.Schema({
    title: String,
    url: String, // Cloudinary URL
    type: String, // 'image' or 'video'
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Gallery = mongoose.model('Gallery', gallerySchema);

// 3. Messages
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: String,
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Message = mongoose.model('Message', messageSchema);

// 4. Orders
const orderSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    image: String, // Product Image URL
    customer: String,
    phone: String,
    email: String,
    address: String,
    status: { type: String, default: 'Pending' },
    date: String,
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Order = mongoose.model('Order', orderSchema);

// 5. Admin Settings
const settingSchema = new mongoose.Schema({
    type: String, // 'admin'
    username: String,
    password: String
});
const Setting = mongoose.model('Setting', settingSchema);

// 6. User (For Likes & Accounts)
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true, sparse: true }, // Added for Google Auth
    password: String, // In real app, hash this!
    likedProducts: [String],
    likedGallery: [String]
}, schemaOptions);
const User = mongoose.model('User', userSchema);


// --- ROUTES ---

// Helper to catch errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ACTIONS
app.get('/api/products', asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
}));

app.post('/api/products', asyncHandler(async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
}));

app.delete('/api/products/:id', asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

app.put('/api/products/:id/like', asyncHandler(async (req, res) => {
    const { increment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.likes += increment ? 1 : -1;
        await product.save();
        res.json(product);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
}));

// GALLERY
app.get('/api/gallery', asyncHandler(async (req, res) => {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
}));

app.post('/api/gallery', asyncHandler(async (req, res) => {
    const newItem = new Gallery(req.body);
    await newItem.save();
    res.json(newItem);
}));

app.delete('/api/gallery/:id', asyncHandler(async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

app.put('/api/gallery/:id/like', asyncHandler(async (req, res) => {
    const { increment } = req.body;
    const item = await Gallery.findById(req.params.id);
    if (item) {
        item.likes += increment ? 1 : -1;
        await item.save();
        res.json(item);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
}));

// MESSAGES
app.get('/api/messages', asyncHandler(async (req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
}));

app.post('/api/messages', asyncHandler(async (req, res) => {
    const newMsg = new Message({
        ...req.body,
        date: new Date().toLocaleDateString()
    });
    await newMsg.save();
    res.json(newMsg);
}));

app.delete('/api/messages/:id', asyncHandler(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

// ORDERS
app.get('/api/orders', asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
}));

app.post('/api/orders', asyncHandler(async (req, res) => {
    const newOrder = new Order({
        ...req.body,
        date: new Date().toLocaleDateString()
    });
    await newOrder.save();
    res.json(newOrder);
}));

app.delete('/api/orders/:id', asyncHandler(async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

const bcrypt = require('bcryptjs'); // Add this at top

// ADMIN AUTH
app.get('/api/admin/password', asyncHandler(async (req, res) => {
    let setting = await Setting.findOne({ type: 'admin' });
    if (!setting) {
        // Create default admin with username 'aslam' and hashed password '313aslam786'
        const hashedPassword = await bcrypt.hash('313aslam786', 10);
        setting = new Setting({ type: 'admin', username: 'aslam', password: hashedPassword });
        await setting.save();
    }
    // We strictly DO NOT send the password back now. 
    // We send a success flag or null to indicate it exists.
    res.json({ configured: true });
}));

// Validate Admin Password (New Route for checking)
app.post('/api/admin/verify', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const setting = await Setting.findOne({ type: 'admin' });
    if (setting && setting.username === username && await bcrypt.compare(password, setting.password)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
}));

app.post('/api/admin/password', asyncHandler(async (req, res) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Setting.findOneAndUpdate({ type: 'admin' }, { password: hashedPassword }, { upsert: true });
    res.json({ success: true });
}));

// Google Authentication
app.post('/api/users/google-auth', asyncHandler(async (req, res) => {
    const { email, name, googleId } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        res.json(user);
    } else {
        const password = await bcrypt.hash(googleId + "secure_art_void", 10);
        user = await User.create({
            username: name,
            email,
            password,
            likedProducts: [],
            likedGallery: []
        });
        res.status(201).json(user);
    }
}));

// USER AUTH
app.post('/api/auth/register', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, likedProducts: [], likedGallery: [] });
    await newUser.save();
    res.json(newUser);
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json(user);
}));

app.put('/api/users/:id/likes', asyncHandler(async (req, res) => {
    const { likedProducts, likedGallery } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
        if (likedProducts) user.likedProducts = likedProducts;
        if (likedGallery) user.likedGallery = likedGallery;
        await user.save();
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
