const express = require('express');
var bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
const bookRepository = require('./repositories/bookRepository');
const userRepository = require('./repositories/userRepository');

const app = express();
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Clear database and seed it with test data
app.get('/init', function (req, res) {
    bookRepository.dropDatabase().then(
        bookRepository.seedData()
        .then(() => { return res.status(200).json({ message: "Database created and seeded with test data" }); })
    );
})

// Get all books
app.get('/books', function (req, res) {
    bookRepository.get()
        .then((items) => {
            console.log(items);
            return res.status(200).json({
                message: "Items listed successfully",
                books: [items]
            });
        }).catch((reason) => {
            console.log(reason)
        });
})

// Add a book to the collection
app.post('/add', function (req, res) {
    bookRepository.add(req.body).then((itemId) => {
        bookRepository.getById(itemId).then((item) => {
            console.log("Item added: " + item);
            return res.status(200).json({
                message: "Item added.", 
                item: item
            });
        });
    });
})

app.get('/user', function (req, res) {
    try {
        console.log(req.cookies);
        console.log(req.cookies['user']);
        userRepository.getById(req.cookies['user']).then((user) => {
            console.log(user);
            if (user === null) {
                return res.status(401).json({id: user});
            } else {
                return res.status(200).json({id: user});
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "You are not logged in"});
    }
})

app.get('/logout', function (req, res) {
    console.log("logged out");
    return res.clearCookie('user').status(200).json({message: "Logged out"});
})

// login a user
app.post('/login', function (req, res) {
    let loginUser = null;
    userRepository.get().then((users) => {
        users.forEach(user => {
            if (user.email === req.body.email) {
               
                loginUser = {
                    id: user._id,
                    email: user.email,
                    password: user.password
                }
                console.log(loginUser);
            }
        });

        if (!loginUser) {
            return res.status(404).json({message: "User not found"});
        }

        bcrypt.compare(req.body.password, loginUser.password).then((result) => {
            if (result === false) {
                console.log("wrong pswd");
                return res.status(401).json({message: "Worng password"});
            }

            return res.cookie('user', String(loginUser.id)).send("logged in successfully");
        });
    });
})
    
// register a user
app.post('/register', function (req, res) {
    console.log(req.body.email, req.body.password);
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        const newUser = {
          email: req.body.email,
          password: hashedPassword,
        };
        var userExists = false;
        userRepository.get().then((users) => {
            users.forEach(user => {
                if (user.email === newUser.email) {
                    userExists = true;
                }
            });

            if (userExists)
                return res.status(409).json({message: "User already exists"});

            userRepository.add(newUser).then((newUserId) => {
                userRepository.getById(newUserId).then((savedUser) => {
                    console.log(savedUser);
                    return res.status(201).json({
                        message: "User created",
                        user: savedUser
                    });
                });
            });
        });
    });
})

var server = app.listen(8081, function () {
    var host = "localhost"
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
})