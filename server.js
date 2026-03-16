const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session configuration - FIXED
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: true, // Changed to true for better debugging
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/student-course-registration';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    registeredCourses: [{ type: String }]
});

const User = mongoose.model('User', userSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
    courseId: { type: String, unique: true, required: true },
    courseName: { type: String, required: true },
    instructor: { type: String, required: true },
    credits: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
});

const Course = mongoose.model('Course', courseSchema);

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Please login first' });
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/home', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    } else {
        res.redirect('/login');
    }
});

// API Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            registeredCourses: []
        });

        await user.save();
        console.log(`✅ New user registered: ${email}`);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session - FIXED
        req.session.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        };

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Login failed' });
            }
            console.log(`✅ User logged in: ${email}`);
            res.json({ 
                message: 'Login successful', 
                user: req.session.user 
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register for a course - FIXED
app.post('/api/register-course', requireLogin, async (req, res) => {
    try {
        const { courseId } = req.body;
        
        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        // Check if user is logged in
        if (!req.session || !req.session.user || !req.session.user.id) {
            console.error('No user in session');
            return res.status(401).json({ error: 'Please login first' });
        }

        const userId = req.session.user.id;
        console.log(`Attempting to register user ${userId} for course ${courseId}`);

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already registered
        if (!user.registeredCourses.includes(courseId)) {
            user.registeredCourses.push(courseId);
            await user.save();
            console.log(`✅ User registered for course: ${courseId}`);
            res.json({ message: 'Course registered successfully' });
        } else {
            res.status(400).json({ error: 'Already registered for this course' });
        }

    } catch (error) {
        console.error('Course registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's registered courses - FIXED
app.get('/api/my-courses', requireLogin, async (req, res) => {
    try {
        if (!req.session || !req.session.user || !req.session.user.id) {
            return res.status(401).json({ error: 'Please login first' });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.registeredCourses);
    } catch (error) {
        console.error('Error fetching my courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Check login status
app.get('/api/check-login', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Initialize courses
async function initializeCourses() {
    try {
        const count = await Course.countDocuments();
        if (count === 0) {
            const courses = [
                { courseId: 'CS101', courseName: 'Introduction to Computer Science', instructor: 'Dr. Smith', credits: 3, availableSeats: 30 },
                { courseId: 'MATH201', courseName: 'Calculus II', instructor: 'Dr. Johnson', credits: 4, availableSeats: 25 },
                { courseId: 'PHY101', courseName: 'Physics Fundamentals', instructor: 'Dr. Williams', credits: 3, availableSeats: 20 },
                { courseId: 'ENG102', courseName: 'English Literature', instructor: 'Prof. Brown', credits: 3, availableSeats: 35 },
                { courseId: 'HIST205', courseName: 'World History', instructor: 'Dr. Davis', credits: 3, availableSeats: 40 }
            ];
            await Course.insertMany(courses);
            console.log('✅ Sample courses created');
        } else {
            console.log('📚 Courses already exist in database');
        }
    } catch (error) {
        console.error('Error initializing courses:', error);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Open http://localhost:${PORT}/login to access the application`);
    initializeCourses();
});