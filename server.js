const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zencampus';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
        }
    }
});

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB:', MONGODB_URI))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);


const washingMachineSchema = new mongoose.Schema({
    machineNumber: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'in-use', 'faulty'],
        default: 'available'
    },
    userUSN: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: null
    },
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    repairEndTime: {
        type: Date,
        default: null
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const WashingMachine = mongoose.model('WashingMachine', washingMachineSchema);

const dryerMachineSchema = new mongoose.Schema({
    machineNumber: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'in-use', 'faulty'],
        default: 'available'
    },
    userUSN: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: null
    },
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    repairEndTime: {
        type: Date,
        default: null
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const DryerMachine = mongoose.model('DryerMachine', dryerMachineSchema);

const complaintSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['electrical', 'plumbing', 'carpentry', 'room', 'bathroom'],
        required: true
    },
    userUSN: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

setInterval(async () => {
    try {
        const now = new Date();
                
        await WashingMachine.updateMany(
            { status: 'in-use', endTime: { $lt: now } },
            { $set: { status: 'available', userUSN: null, userName: null, startTime: null, endTime: null, lastUpdated: now } }
        );
                
        await DryerMachine.updateMany(
            { status: 'in-use', endTime: { $lt: now } },
            { $set: { status: 'available', userUSN: null, userName: null, startTime: null, endTime: null, lastUpdated: now } }
        );
                
        await WashingMachine.updateMany(
            { status: 'faulty', repairEndTime: { $lt: now } },
            { $set: { status: 'available', repairEndTime: null, lastUpdated: now } }
        );
        
        await DryerMachine.updateMany(
            { status: 'faulty', repairEndTime: { $lt: now } },
            { $set: { status: 'available', repairEndTime: null, lastUpdated: now } }
        );
    } catch (error) {
        console.error('Auto-cleanup error:', error);
    }
}, 60000);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ZenCampus API is running' });
});

app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();

        const workDoneToday = Math.floor(Math.random() * 50) + 20;
        const dueWork = Math.floor(Math.random() * 20) + 5;

        res.json({
            success: true,
            totalStudents,
            workDoneToday,
            dueWork
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            totalStudents: 0,
            workDoneToday: 0,
            dueWork: 0
        });
    }
});

app.get('/api/washing-machines', async (req, res) => {
    try {
        const machines = await WashingMachine.find().sort({ machineNumber: 1 });

        res.json({
            success: true,
            machines
        });
    } catch (error) {
        console.error('Error fetching washing machines:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching washing machines',
            machines: []
        });
    }
});

app.get('/api/washing-machines/:machineNumber', async (req, res) => {
    try {
        const machine = await WashingMachine.findOne({ 
            machineNumber: parseInt(req.params.machineNumber) 
        });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        res.json({
            success: true,
            machine
        });
    } catch (error) {
        console.error('Error fetching machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching machine'
        });
    }
});

app.post('/api/washing-machines/:machineNumber/book', async (req, res) => {
    try {
        const { usn, durationMinutes } = req.body;
        const machineNumber = parseInt(req.params.machineNumber);

        if (!usn || !durationMinutes) {
            return res.status(400).json({
                success: false,
                message: 'USN and duration are required'
            });
        }

        const machine = await WashingMachine.findOne({ machineNumber });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        if (machine.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Machine is not available'
            });
        }

        const user = await User.findOne({ usn: usn.toUpperCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        machine.status = 'in-use';
        machine.userUSN = user.usn;
        machine.userName = user.name;
        machine.startTime = startTime;
        machine.endTime = endTime;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine booked successfully',
            machine
        });

    } catch (error) {
        console.error('Error booking machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking machine'
        });
    }
});

app.post('/api/washing-machines/:machineNumber/release', async (req, res) => {
    try {
        const machineNumber = parseInt(req.params.machineNumber);

        const machine = await WashingMachine.findOne({ machineNumber });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        machine.status = 'available';
        machine.userUSN = null;
        machine.userName = null;
        machine.startTime = null;
        machine.endTime = null;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine released successfully',
            machine
        });

    } catch (error) {
        console.error('Error releasing machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error releasing machine'
        });
    }
});

app.post('/api/washing-machines/:machineNumber/faulty', async (req, res) => {
    try {
        const machineNumber = parseInt(req.params.machineNumber);
        const { repairDurationMinutes } = req.body;

        const machine = await WashingMachine.findOne({ machineNumber });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        const repairEndTime = repairDurationMinutes 
            ? new Date(Date.now() + repairDurationMinutes * 60000)
            : new Date(Date.now() + 120 * 60000);

        machine.status = 'faulty';
        machine.userUSN = null;
        machine.userName = null;
        machine.startTime = null;
        machine.endTime = null;
        machine.repairEndTime = repairEndTime;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine marked as faulty',
            machine
        });

    } catch (error) {
        console.error('Error marking machine as faulty:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking machine as faulty'
        });
    }
});

app.post('/api/washing-machines/check-availability', async (req, res) => {
    try {
        const { machineNumber, startTime, endTime } = req.body;

        if (!machineNumber || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                available: false,
                message: 'Machine number, start time, and end time are required'
            });
        }

        const machine = await WashingMachine.findOne({ machineNumber: parseInt(machineNumber) });

        if (!machine) {
            return res.status(404).json({
                success: false,
                available: false,
                message: 'Machine not found'
            });
        }

        if (machine.status === 'faulty') {
            return res.json({
                success: true,
                available: false,
                message: 'Machine is currently under maintenance'
            });
        }

        const requestedStart = new Date(startTime);
        const requestedEnd = new Date(endTime);
        const now = new Date();

        if (machine.status === 'in-use' && machine.endTime) {
            const machineEnd = new Date(machine.endTime);

            if (requestedStart < machineEnd) {
                return res.json({
                    success: true,
                    available: false,
                    message: `Machine is booked until ${machineEnd.toLocaleString()}`
                });
            }
        }

        res.json({
            success: true,
            available: true,
            message: 'Slot is available'
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({
            success: false,
            available: false,
            message: 'Error checking availability'
        });
    }
});

app.post('/api/washing-machines/book', async (req, res) => {
    try {
        const { machineNumber, washType, startTime, endTime, userUSN, userName } = req.body;

        if (!machineNumber || !washType || !startTime || !endTime || !userUSN || !userName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const machine = await WashingMachine.findOne({ machineNumber: parseInt(machineNumber) });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        if (machine.status === 'faulty') {
            return res.status(400).json({
                success: false,
                message: 'Machine is under maintenance'
            });
        }

        const requestedStart = new Date(startTime);
        const requestedEnd = new Date(endTime);

        if (machine.status === 'in-use' && machine.endTime) {
            const machineEnd = new Date(machine.endTime);

            if (requestedStart < machineEnd) {
                return res.status(400).json({
                    success: false,
                    message: 'Time slot is not available'
                });
            }
        }

        machine.status = 'in-use';
        machine.userUSN = userUSN;
        machine.userName = userName;
        machine.startTime = requestedStart;
        machine.endTime = requestedEnd;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine booked successfully',
            machine
        });

    } catch (error) {
        console.error('Error booking machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking machine'
        });
    }
});

app.post('/api/dryer-machines/book', async (req, res) => {
    try {
        const { machineNumber, dryType, startTime, endTime, userUSN, userName } = req.body;

        if (!machineNumber || !dryType || !startTime || !endTime || !userUSN || !userName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const machine = await DryerMachine.findOne({ machineNumber: parseInt(machineNumber) });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        if (machine.status === 'faulty') {
            return res.status(400).json({
                success: false,
                message: 'Machine is under maintenance'
            });
        }

        const requestedStart = new Date(startTime);
        const requestedEnd = new Date(endTime);

        if (machine.status === 'in-use' && machine.endTime) {
            const machineEnd = new Date(machine.endTime);

            if (requestedStart < machineEnd) {
                return res.status(400).json({
                    success: false,
                    message: 'Time slot is not available'
                });
            }
        }

        machine.status = 'in-use';
        machine.userUSN = userUSN;
        machine.userName = userName;
        machine.startTime = requestedStart;
        machine.endTime = requestedEnd;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine booked successfully',
            machine
        });

    } catch (error) {
        console.error('Error booking dryer machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking machine'
        });
    }
});

app.get('/api/dryer-machines', async (req, res) => {
    try {
        const machines = await DryerMachine.find().sort({ machineNumber: 1 });

        res.json({
            success: true,
            machines
        });
    } catch (error) {
        console.error('Error fetching dryer machines:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dryer machines',
            machines: []
        });
    }
});

app.get('/api/dryer-machines/:machineNumber', async (req, res) => {
    try {
        const machine = await DryerMachine.findOne({ 
            machineNumber: parseInt(req.params.machineNumber) 
        });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        res.json({
            success: true,
            machine
        });
    } catch (error) {
        console.error('Error fetching machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching machine'
        });
    }
});

app.post('/api/dryer-machines/:machineNumber/book', async (req, res) => {
    try {
        const { usn, durationMinutes } = req.body;
        const machineNumber = parseInt(req.params.machineNumber);

        if (!usn || !durationMinutes) {
            return res.status(400).json({
                success: false,
                message: 'USN and duration are required'
            });
        }

        const machine = await DryerMachine.findOne({ machineNumber });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        if (machine.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Machine is not available'
            });
        }

        const user = await User.findOne({ usn: usn.toUpperCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        machine.status = 'in-use';
        machine.userUSN = user.usn;
        machine.userName = user.name;
        machine.startTime = startTime;
        machine.endTime = endTime;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine booked successfully',
            machine
        });

    } catch (error) {
        console.error('Error booking machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking machine'
        });
    }
});

app.post('/api/dryer-machines/:machineNumber/release', async (req, res) => {
    try {
        const machineNumber = parseInt(req.params.machineNumber);

        const machine = await DryerMachine.findOne({ machineNumber });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        machine.status = 'available';
        machine.userUSN = null;
        machine.userName = null;
        machine.startTime = null;
        machine.endTime = null;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine released successfully',
            machine
        });

    } catch (error) {
        console.error('Error releasing machine:', error);
        res.status(500).json({
            success: false,
            message: 'Error releasing machine'
        });
    }
});

app.post('/api/dryer-machines/:machineNumber/faulty', async (req, res) => {
    try {
        const machineNumber = parseInt(req.params.machineNumber);
        const { repairDurationMinutes } = req.body;

        const machine = await DryerMachine.findOne({ machineNumber });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        const repairEndTime = repairDurationMinutes 
            ? new Date(Date.now() + repairDurationMinutes * 60000)
            : new Date(Date.now() + 120 * 60000);

        machine.status = 'faulty';
        machine.userUSN = null;
        machine.userName = null;
        machine.startTime = null;
        machine.endTime = null;
        machine.repairEndTime = repairEndTime;
        machine.lastUpdated = new Date();

        await machine.save();

        res.json({
            success: true,
            message: 'Machine marked as faulty',
            machine
        });

    } catch (error) {
        console.error('Error marking machine as faulty:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking machine as faulty'
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { usn, password } = req.body;

        if (!usn || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'USN and password are required' 
            });
        }

        const user = await User.findOne({ usn: usn.toUpperCase() });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid USN or password' 
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid USN or password' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                usn: user.usn,
                name: user.name,
                mobile: user.mobile
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

app.post('/api/forgot-password/verify', async (req, res) => {
    try {
        const { usn, mobile } = req.body;

        if (!usn || !mobile) {
            return res.status(400).json({ 
                success: false, 
                message: 'USN and mobile number are required' 
            });
        }

        const user = await User.findOne({ 
            usn: usn.toUpperCase(),
            mobile: mobile 
        });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'No account found with this USN and mobile number' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Identity verified',
            usn: user.usn
        });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during verification' 
        });
    }
});

app.post('/api/forgot-password/reset', async (req, res) => {
    try {
        const { usn, newPassword } = req.body;

        if (!usn || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'USN and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }

        const user = await User.findOne({ usn: usn.toUpperCase() });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Password updated successfully' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during password reset' 
        });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { usn, password, mobile, name } = req.body;

        if (!usn || !password || !mobile || !name) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const existingUser = await User.findOne({ usn: usn.toUpperCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'USN already registered' 
            });
        }

        const user = new User({
            usn: usn.toUpperCase(),
            password,
            mobile,
            name
        });

        await user.save();

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: {
                usn: user.usn,
                name: user.name,
                mobile: user.mobile
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

app.get('/api/complaints/:category', async (req, res) => {
    try {
        const category = req.params.category;

        if (!['electrical', 'plumbing', 'carpentry', 'room', 'bathroom'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const complaints = await Complaint.find({ category }).sort({ createdAt: -1 });

        res.json({
            success: true,
            complaints
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints',
            complaints: []
        });
    }
});

app.get('/api/complaints/:category/stats', async (req, res) => {
    try {
        const category = req.params.category;

        if (!['electrical', 'plumbing', 'carpentry', 'room', 'bathroom'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const total = await Complaint.countDocuments({ category });
        const completed = await Complaint.countDocuments({ category, status: 'completed' });
        const remaining = await Complaint.countDocuments({ category, status: 'pending' });

        res.json({
            success: true,
            stats: {
                total,
                completed,
                remaining
            }
        });
    } catch (error) {
        console.error('Error fetching complaint stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaint statistics',
            stats: {
                total: 0,
                completed: 0,
                remaining: 0
            }
        });
    }
});

app.post('/api/complaints', upload.single('photo'), async (req, res) => {
    try {
        const { category, usn, description, location } = req.body;

        if (!category || !usn || !description || !location) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!['electrical', 'plumbing', 'carpentry', 'room', 'bathroom'].includes(category)) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const user = await User.findOne({ usn: usn.toUpperCase() });

        if (!user) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const complaint = new Complaint({
            category,
            userUSN: user.usn,
            userName: user.name,
            description,
            location,
            photo: req.file ? `/uploads/${req.file.filename}` : null,
            status: 'pending'
        });

        await complaint.save();

        res.status(201).json({
            success: true,
            message: 'Complaint registered successfully',
            complaint
        });

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error creating complaint:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating complaint'
        });
    }
});

app.post('/api/complaints/:id/complete', async (req, res) => {
    try {
        const complaintId = req.params.id;

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        complaint.status = 'completed';
        complaint.completedAt = new Date();

        await complaint.save();

        res.json({
            success: true,
            message: 'Complaint marked as completed',
            complaint
        });

    } catch (error) {
        console.error('Error completing complaint:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing complaint'
        });
    }
});

app.delete('/api/complaints/:id', async (req, res) => {
    try {
        const complaintId = req.params.id;

        const complaint = await Complaint.findByIdAndDelete(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        res.json({
            success: true,
            message: 'Complaint deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting complaint'
        });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { adminId, password } = req.body;

        if (!adminId || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Admin ID and password are required' 
            });
        }

        const ADMIN_ID = process.env.ADMIN_ID || 'admin';
        const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

        if (adminId.trim() !== ADMIN_ID) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        let passwordMatch = false;
        if (ADMIN_PASS.startsWith('$2')) {
            passwordMatch = await bcrypt.compare(password, ADMIN_PASS);
        } else {
            passwordMatch = password === ADMIN_PASS;
        }

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({ 
            success: true, 
            message: 'Admin login successful',
            admin: {
                adminId: ADMIN_ID,
                name: process.env.ADMIN_NAME || 'Administrator',
                email: process.env.ADMIN_EMAIL || '',
                role: process.env.ADMIN_ROLE || 'super-admin'
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Server error during admin login' });
    }
});

app.post('/api/admin/users', async (req, res) => {
    try {
        const { usn, password, mobile, name } = req.body;

        if (!usn || !password || !mobile || !name) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const existingUser = await User.findOne({ usn: usn.toUpperCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'USN already registered' 
            });
        }

        const user = new User({
            usn: usn.toUpperCase(),
            password,
            mobile,
            name
        });

        await user.save();

        res.status(201).json({ 
            success: true, 
            message: 'User added successfully',
            user: {
                usn: user.usn,
                name: user.name,
                mobile: user.mobile
            }
        });

    } catch (error) {
        console.error('Add user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during user addition' 
        });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            users: []
        });
    }
});

app.delete('/api/admin/users/:usn', async (req, res) => {
    try {
        const usn = req.params.usn.toUpperCase();

        const user = await User.findOneAndDelete({ usn });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
});

app.get('/api/admin/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            complaints
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints',
            complaints: []
        });
    }
});

app.get('/api/admin/machines', async (req, res) => {
    try {
        const washingMachines = await WashingMachine.find().sort({ machineNumber: 1 });
        const dryerMachines = await DryerMachine.find().sort({ machineNumber: 1 });

        res.json({
            success: true,
            washingMachines,
            dryerMachines
        });
    } catch (error) {
        console.error('Error fetching machines:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching machines',
            washingMachines: [],
            dryerMachines: []
        });
    }
});

app.post('/api/admin/init-machines', async (req, res) => {
    try {
        const { washingCount, dryerCount } = req.body;

        if (!washingCount || !dryerCount) {
            return res.status(400).json({
                success: false,
                message: 'Machine counts are required'
            });
        }

        await WashingMachine.deleteMany({});
        await DryerMachine.deleteMany({});

        for (let i = 1; i <= washingCount; i++) {
            await new WashingMachine({ machineNumber: i }).save();
        }

        for (let i = 1; i <= dryerCount; i++) {
            await new DryerMachine({ machineNumber: i }).save();
        }

        res.json({
            success: true,
            message: `Initialized ${washingCount} washing machines and ${dryerCount} dryer machines`
        });

    } catch (error) {
        console.error('Error initializing machines:', error);
        res.status(500).json({
            success: false,
            message: 'Error initializing machines'
        });
    }
});

app.listen(PORT, () => {
    console.log(`ZenCampus server running on http://localhost:${PORT}`);
    console.log(`Serving static files from: ${__dirname}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
});
