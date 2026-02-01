const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Added here
dotenv.config();
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*', // Allow all origins for now (or specify 'https://art-void.vercel.app')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
    comments: [{
        username: String,
        text: String,
        date: { type: Date, default: Date.now }
    }],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' }, // 'pending', 'active', 'frozen'
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Product = mongoose.model('Product', productSchema);

// 2. Gallery
const gallerySchema = new mongoose.Schema({
    title: String,
    url: String, // Cloudinary URL
    type: String, // 'image' or 'video'
    category: String,
    medium: String,
    description: String,
    likes: { type: Number, default: 0 },
    comments: [{
        username: String,
        text: String,
        date: { type: Date, default: Date.now }
    }],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' }, // 'pending', 'active', 'frozen'
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Gallery = mongoose.model('Gallery', gallerySchema);

// 3. Messages
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    message: String,
    image: String, // Base64 or URL
    type: { type: String, default: 'inquiry' }, // 'inquiry', 'service', 'internal'
    senderId: String,
    receiverId: String,
    isInternal: { type: Boolean, default: false },
    date: String,
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const Message = mongoose.model('Message', messageSchema);

// 4. Orders
const orderSchema = new mongoose.Schema({
    productName: String,
    productId: String,
    image: String,
    price: Number,
    priceGiven: { type: Boolean, default: false },
    customer: String,
    customerId: String,
    creatorId: String,
    phone: String,
    email: String,
    address: String,
    notes: String,
    type: { type: String, default: 'product' },
    status: { type: String, default: 'Pending Price' },
    deliveryStatus: { type: String, default: 'Pending' },
    adminCommission: { type: Number, default: 0 },
    artistEarnings: { type: Number, default: 0 },
    estimatedDays: { type: Number, default: 0 },
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
    email: { type: String, unique: true, sparse: true },
    password: String,
    phone: String,
    role: { type: String, default: 'user' }, // 'user', 'emblos'
    isFrozen: { type: Boolean, default: false },
    likedProducts: [String],
    likedGallery: [String],
    googleId: String,
    avatar: String,
    emblosAccess: {
        status: { type: String, default: 'none' }, // 'none', 'pending', 'active'
        message: String,
        phone: String
    },
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);
const User = mongoose.model('User', userSchema);

// 7. App Settings (General)
const appSettingSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    value: mongoose.Schema.Types.Mixed
}, schemaOptions);
const AppSetting = mongoose.model('AppSetting', appSettingSchema);


// --- ROUTES ---

// Helper to catch errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// APP SETTINGS
app.get('/api/settings/:key', asyncHandler(async (req, res) => {
    const setting = await AppSetting.findOne({ key: req.params.key });
    res.json(setting || { key: req.params.key, value: null });
}));

app.post('/api/settings/:key', asyncHandler(async (req, res) => {
    const { value } = req.body;
    const setting = await AppSetting.findOneAndUpdate(
        { key: req.params.key },
        { value },
        { upsert: true, new: true }
    );
    res.json(setting);
}));

// USER MANAGEMENT
app.get('/api/users', asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
}));

app.delete('/api/users/delete-by-email', asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
    }
    // Also cleanup their products and gallery items
    await Promise.all([
        Product.deleteMany({ creatorId: user._id }),
        Gallery.deleteMany({ creatorId: user._id })
    ]);
    res.json({ message: 'User and their content deleted successfully' });
}));

// ACTIONS
app.get('/api/products', asyncHandler(async (req, res) => {
    // PUBLIC view: only active items from non-frozen users
    const filter = req.query.all === 'true' ? {} : { status: 'active' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
}));

// Self-healing migration for existing data
const runMigration = async () => {
    try {
        // 1. Mark legacy items as active if they have no status
        const pMod = await Product.updateMany({ status: { $exists: false } }, { $set: { status: 'active' } });
        const gMod = await Gallery.updateMany({ status: { $exists: false } }, { $set: { status: 'active' } });

        // 2. Ensure all items of frozen users are marked frozen
        const frozenUsers = await User.find({ isFrozen: true });
        for (const user of frozenUsers) {
            await Product.updateMany({ creatorId: user._id }, { status: 'frozen' });
            await Gallery.updateMany({ creatorId: user._id }, { status: 'frozen' });
        }

        console.log("✅ Data integrity check & migration complete.");
    } catch (e) {
        console.error("Migration error:", e);
    }
};
runMigration();

app.post('/api/products', asyncHandler(async (req, res) => {
    const { creatorId } = req.body;
    let initialStatus = 'pending';

    if (creatorId) {
        const user = await User.findById(creatorId);
        if (user && user.role === 'emblos' && !user.isFrozen) {
            initialStatus = 'active';
        }
    }

    const newProduct = new Product({
        ...req.body,
        status: req.body.status || initialStatus
    });
    await newProduct.save();
    res.json(newProduct);
}));

app.delete('/api/products/:id', asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

app.put('/api/products/:id', asyncHandler(async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
}));

app.put('/api/products/:id/like', asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;

    const user = await User.findById(userId);
    const product = await Product.findById(id);

    if (!user || !product) return res.status(404).json({ error: 'User or Product not found' });

    const isLiked = user.likedProducts.includes(id);

    if (isLiked) {
        // Unlike
        user.likedProducts = user.likedProducts.filter(pId => pId !== id);
        product.likes = Math.max(0, (product.likes || 0) - 1);
    } else {
        // Like
        user.likedProducts.push(id);
        product.likes = (product.likes || 0) + 1;
    }

    await Promise.all([user.save(), product.save()]);
    res.json({ user, item: product });
}));

app.put('/api/products/:id/comment', asyncHandler(async (req, res) => {
    const { username, text } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.comments.push({ username, text });
    await product.save();
    res.json(product);
}));

app.delete('/api/products/:id/comment/:commentId', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.comments = product.comments.filter(c => c._id.toString() !== req.params.commentId);
    await product.save();
    res.json(product);
}));

app.get('/api/gallery', asyncHandler(async (req, res) => {
    // PUBLIC view: only active items from non-frozen users
    const filter = req.query.all === 'true' ? {} : { status: 'active' };
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(items);
}));

app.post('/api/gallery', asyncHandler(async (req, res) => {
    const { creatorId } = req.body;
    let initialStatus = 'pending';

    if (creatorId) {
        const user = await User.findById(creatorId);
        if (user && user.role === 'emblos' && !user.isFrozen) {
            initialStatus = 'active';
        }
    }

    const newItem = new Gallery({
        ...req.body,
        status: req.body.status || initialStatus
    });
    await newItem.save();
    res.json(newItem);
}));

app.delete('/api/gallery/:id', asyncHandler(async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

app.put('/api/gallery/:id', asyncHandler(async (req, res) => {
    const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
}));

app.put('/api/gallery/:id/like', asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;

    const user = await User.findById(userId);
    const item = await Gallery.findById(id);

    if (!user || !item) return res.status(404).json({ error: 'User or Artwork not found' });

    const isLiked = user.likedGallery.includes(id);

    if (isLiked) {
        // Unlike
        user.likedGallery = user.likedGallery.filter(gId => gId !== id);
        item.likes = Math.max(0, (item.likes || 0) - 1);
    } else {
        // Like
        user.likedGallery.push(id);
        item.likes = (item.likes || 0) + 1;
    }

    await Promise.all([user.save(), item.save()]);
    res.json({ user, item });
}));

app.put('/api/gallery/:id/comment', asyncHandler(async (req, res) => {
    const { username, text } = req.body;
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Artwork not found' });

    item.comments.push({ username, text });
    await item.save();
    res.json(item);
}));

app.delete('/api/gallery/:id/comment/:commentId', asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Artwork not found' });

    item.comments = item.comments.filter(c => c._id.toString() !== req.params.commentId);
    await item.save();
    res.json(item);
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

// --- EMBLOS ACCESS ROUTES ---
app.post('/api/users/:id/request-emblos', asyncHandler(async (req, res) => {
    const { message, phone } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.phone = phone;
    // Auto-approve join, but uploads still need approval
    user.role = 'emblos';
    user.emblosAccess = {
        status: 'active',
        message
    };
    await user.save();
    res.json(user);
}));

app.put('/api/users/:id/emblos-status', asyncHandler(async (req, res) => {
    const { status, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (status === 'active' || status === 'unfreeze') {
        user.emblosAccess.status = 'active';
        user.role = 'emblos';
        user.isFrozen = false;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
    } else if (status === 'frozen') {
        user.isFrozen = true;
    } else if (status === 'none' || status === 'rejected') {
        user.emblosAccess.status = 'none';
        user.role = 'user';
    } else {
        user.emblosAccess.status = status;
    }

    await user.save();

    // Update all their items status based on frozen state
    const itemStatus = user.isFrozen ? 'frozen' : (user.role === 'emblos' ? 'active' : 'pending');
    await Promise.all([
        Product.updateMany({ creatorId: user._id }, { status: itemStatus }),
        Gallery.updateMany({ creatorId: user._id }, { status: itemStatus })
    ]);

    res.json(user);
}));

// --- ORDER PRICE ROUTES ---
app.put('/api/orders/:id/price', asyncHandler(async (req, res) => {
    const { price, estimatedDays } = req.body;

    if (estimatedDays && (estimatedDays < 1 || estimatedDays > 30)) {
        return res.status(400).json({ message: "Estimated days must be between 1 and 30" });
    }

    // Fetch commission rate from settings (default to 10%)
    const config = await AppSetting.findOne({ key: 'emblos_config' });
    const commissionRate = config?.value?.commissionRate || 10;

    const adminCommission = (price * commissionRate) / 100;
    const artistEarnings = price - adminCommission;

    const order = await Order.findByIdAndUpdate(req.params.id, {
        price,
        estimatedDays,
        priceGiven: true,
        status: 'Approved',
        adminCommission,
        artistEarnings
    }, { new: true });
    res.json(order);
}));

app.put('/api/orders/:id/approve-price', asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: 'Approved'
    }, { new: true });
    res.json(order);
}));

app.put('/api/orders/:id/claim', asyncHandler(async (req, res) => {
    const { creatorId, price, estimatedDays } = req.body;
    const updateData = { creatorId };

    if (estimatedDays) {
        if (estimatedDays < 1 || estimatedDays > 30) {
            return res.status(400).json({ message: "Estimated days must be between 1 and 30" });
        }
        updateData.estimatedDays = estimatedDays;
    }

    if (price) {
        updateData.price = price;
        updateData.priceGiven = true;
        updateData.status = 'Approved';

        // Fetch commission rate
        const config = await AppSetting.findOne({ key: 'emblos_config' });
        const commissionRate = config?.value?.commissionRate || 10;

        updateData.adminCommission = (price * commissionRate) / 100;
        updateData.artistEarnings = price - updateData.adminCommission;
    } else {
        updateData.status = 'Pending Price';
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(order);
}));

// --- INTERNAL MESSAGING ---
app.post('/api/messages/internal', asyncHandler(async (req, res) => {
    const newMsg = new Message({
        ...req.body,
        isInternal: true,
        type: 'internal',
        date: new Date().toLocaleDateString()
    });
    await newMsg.save();
    res.json(newMsg);
}));

// ORDERS
app.get('/api/orders', asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
}));

app.post('/api/orders', asyncHandler(async (req, res) => {
    const { productId, type } = req.body;
    let creatorId = req.body.creatorId || null;
    let image = req.body.image || null;
    let price = req.body.price || 0;
    let adminCommission = 0;
    let artistEarnings = 0;

    // If order is linked to a shop/gallery item, sync image and auto-assign creator
    if (productId) {
        const item = (await Product.findById(productId)) || (await Gallery.findById(productId));
        if (item) {
            creatorId = item.creatorId ? item.creatorId.toString() : null; // Auto-assign to creator
            image = item.image || item.url;
            price = item.price || price;
        }
    }

    let status = (price && price > 0) ? 'Approved' : (type === 'service' ? 'Pending Price' : 'Approved');

    // --- BACKGROUND JOB: Reclaim Stale Orders (older than 3 days) ---
    // If an artist hasn't acted on a direct order in 3 days, move it to common Task Center
    setTimeout(async () => {
        // Check every hour (simplified for logic)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        await Order.updateMany(
            {
                creatorId: { $ne: null },
                $or: [
                    { status: 'Pending Price' },
                    { status: 'Pending Approval' },
                    { status: 'Approved', estimatedDays: { $in: [0, null, undefined] } }
                ],
                createdAt: { $lt: threeDaysAgo }
            },
            { $set: { creatorId: null, status: 'Pending Price', estimatedDays: 0 } }
        );
    }, 1000 * 60 * 60); // Run check roughly every hour (in a real app, use cron)

    if (price > 0) {
        const config = await AppSetting.findOne({ key: 'emblos_config' });
        const commissionRate = config?.value?.commissionRate || 10;
        adminCommission = (price * commissionRate) / 100;
        artistEarnings = price - adminCommission;
    }

    const newOrder = new Order({
        ...req.body,
        price,
        creatorId,
        image,
        status,
        adminCommission,
        artistEarnings,
        date: new Date().toLocaleDateString()
    });
    await newOrder.save();
    res.json(newOrder);
}));

app.delete('/api/orders/:id', asyncHandler(async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}));

app.put('/api/orders/:id/status', asyncHandler(async (req, res) => {
    const { status, deliveryStatus, unassign, estimatedDays } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;
    if (estimatedDays) {
        if (estimatedDays < 1 || estimatedDays > 30) {
            return res.status(400).json({ message: "Estimated days must be between 1 and 30" });
        }
        updateData.estimatedDays = estimatedDays;
    }
    if (unassign) {
        updateData.creatorId = null;
        updateData.status = 'Pending Price';
    }
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedOrder);
}));

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
    let setting = await Setting.findOne({ type: 'admin' });

    // Auto-initialize admin if missing (Self-healing)
    if (!setting) {
        if (username === 'aslam' && password === '313aslam786') {
            const hashedPassword = await bcrypt.hash('313aslam786', 10);
            setting = new Setting({ type: 'admin', username: 'aslam', password: hashedPassword });
            await setting.save();
        } else {
            return res.status(401).json({ success: false });
        }
    }

    if (setting && setting.username === username && await bcrypt.compare(password, setting.password)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
}));

// Reset admin to default (temporary recovery endpoint)
app.post('/api/admin/reset-to-default', asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash('313aslam786', 10);
    await Setting.findOneAndUpdate(
        { type: 'admin' },
        { username: 'aslam', password: hashedPassword },
        { upsert: true }
    );
    res.json({ success: true, message: 'Admin reset to default credentials' });
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
        // Update googleId/avatar if missing (migration path)
        let updated = false;
        if (!user.googleId && googleId) { user.googleId = googleId; updated = true; }
        if (req.body.avatar && user.avatar !== req.body.avatar) { user.avatar = req.body.avatar; updated = true; }
        if (updated) await user.save();
        res.json(user);
    } else {
        const password = await bcrypt.hash(googleId + "secure_art_void", 10);
        user = await User.create({
            username: name,
            email,
            password,
            googleId,
            avatar: req.body.avatar,
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
