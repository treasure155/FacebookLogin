const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3050;

mongoose.connect('mongodb://localhost:27017/facebook-signup')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/User');

app.get('/', (req, res) => {
    res.render('login'); 
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.redirect('/success'); 
        } else {
            res.status(401).send('Invalid credentials.');
        }
    } catch (error) {
        res.status(500).send('Error during login.');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup'); 
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            password
        });

        await newUser.save();

        res.send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
});

app.get('/success', (req, res) => {
    res.render('success'); 
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
