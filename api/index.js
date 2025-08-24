import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
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
    res.send('Backend server is running with Supabase Auth');
});

// User Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: name,
            }
        }
    });

    if (signUpError) {
        console.error('Supabase sign-up error:', signUpError);
        return res.status(400).json({ message: signUpError.message });
    }

    if (!authData.user) {
        // This case happens when email confirmation is required.
        // The user is created but not logged in.
        return res.status(200).json({ message: "Sign up successful, please check your email for verification." });
    }

    // The trigger `create_default_user_profile` will have already run.
    // Now, we need to update the profile with the correct role and display name.
    const { error: profileError } = await supabase
        .from('app_e255c3cdb5_user_profiles')
        .update({
            user_type: role,
            display_name: name
        })
        .eq('user_id', authData.user.id);

    if (profileError) {
        console.error('Error updating user profile:', profileError);
        return res.status(500).json({ message: 'User created, but failed to update profile role.' });
    }

    res.status(200).json({ message: "Sign up successful!" });
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!authData.user) {
         return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get the user profile information
    const { data: profileData, error: profileError } = await supabase
        .from('user_profile_view') // Use the view to get combined data
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        return res.status(500).json({ message: 'Could not retrieve user profile.' });
    }

    res.json(profileData);
});

export default app;
