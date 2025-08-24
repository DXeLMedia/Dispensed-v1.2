const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// --- Database Helper Functions ---

const readDb = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    // If the file doesn't exist or is corrupted, return a default structure
    return { users: [] };
  }
};

const writeDb = async (db) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

// --- API Endpoints ---

app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Check if email exists
app.get('/api/users/check-email', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const db = await readDb();
    const userExists = db.users.some(user => user.email.toLowerCase() === email.toLowerCase());

    res.json({ exists: userExists });
});

// User Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const db = await readDb();

    const existingUser = db.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role,
        verified: false, // Email not verified on sign-up
        needsRoleSelection: false,
    };

    db.users.push(newUser);
    await writeDb(db);

    // For simplicity, returning the new user. In a real app, you'd likely return a token.
    res.status(201).json(newUser);
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In a real app, you would generate and return a JWT (JSON Web Token) here.
    // For this mock implementation, we'll return the full user object, excluding the password.
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Mock Google Sign Up
app.post('/api/google-signup', async (req, res) => {
    const { name, email } = req.body; // In a real scenario, this would come from the Google token
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const db = await readDb();
    let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // If user doesn't exist, create a new one
    if (!user) {
        user = {
            id: uuidv4(),
            name,
            email,
            password: '', // No password for OAuth users
            role: null, // Role to be selected later
            verified: true, // Google accounts are considered verified
            needsRoleSelection: true,
        };
        db.users.push(user);
        await writeDb(db);
    }

    res.status(200).json(user);
});

// Set user role
app.post('/api/users/:id/select-role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    const db = await readDb();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    db.users[userIndex].role = role;
    db.users[userIndex].needsRoleSelection = false;
    await writeDb(db);

    res.json(db.users[userIndex]);
});

// Mock Email Verification
app.post('/api/users/:id/verify', async (req, res) => {
    const { id } = req.params;
    const db = await readDb();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    db.users[userIndex].verified = true;
    await writeDb(db);

    res.json({ message: 'Email verified successfully', user: db.users[userIndex] });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
