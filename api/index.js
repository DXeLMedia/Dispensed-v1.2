import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Initialization ---
const supabaseUrl = 'https://lkxebvjbbskdbhkfgdip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreGVidmpiYnNrZGJoa2ZnZGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTE3NjIsImV4cCI6MjA2OTUyNzc2Mn0.GBZ3yCa17dTAT-yDMgKfLuIQEtbB8qYENab9ppN4224';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(bodyParser.json());


// --- API Endpoints ---

app.get('/api', (req, res) => {
    res.send('Backend server is running with Supabase');
});

// Check if email exists
app.get('/api/users/check-email', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: "exact one row not found"
        console.error('Error checking email:', error);
        return res.status(500).json({ message: 'Database error' });
    }

    res.json({ exists: !!data });
});

// User Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

    if (checkError && checkError.code !== 'PGRST116') {
        return res.status(500).json({ message: 'Database error on user check' });
    }
    if (existingUser) {
        return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: uuidv4(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        verified: false,
        needsRoleSelection: false,
    };

    const { data, error } = await supabase.from('users').insert(newUser).select().single();

    if (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({ message: 'Could not create user' });
    }

    res.status(201).json(data);
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

    if (error || !user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Mock Google Sign Up
app.post('/api/google-signup', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const { data, error } = await supabase
        .from('users')
        .upsert({
            email: email.toLowerCase(),
            name,
            verified: true,
            needsRoleSelection: true,
        }, { onConflict: 'email' })
        .select()
        .single();

    if (error) {
        console.error('Google signup error:', error);
        return res.status(500).json({ message: 'Could not sign up with Google' });
    }

    res.status(200).json(data);
});

// Set user role
app.post('/api/users/:id/select-role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    const { data, error } = await supabase
        .from('users')
        .update({ role, needsRoleSelection: false })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return res.status(404).json({ message: 'User not found or could not update' });
    }
    res.json(data);
});

// Mock Email Verification
app.post('/api/users/:id/verify', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('users')
        .update({ verified: true })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return res.status(404).json({ message: 'User not found or could not verify' });
    }

    res.json({ message: 'Email verified successfully', user: data });
});

export default app;
