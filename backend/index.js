const { io, server, app, express } = require("./socketConnect.js")
const { router: userAuth } = require("./routes/userAuth");
const cors = require('cors');
const { connectToDB } = require("./connect/connectToDB.js")
//const session = require('express-session');
const cookieParser = require("cookie-parser");

require("dotenv").config()


const PORT = process.env.PORT ||  8000

// Use cookie-parser middleware
app.use(cookieParser());



// Middleware to set Cross-Origin-Opener-Policy
app.use((req, res, next) => {
 // res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
})

// Configure express-session middleware
 // app.use(session({
 //  secret: `${process.env.SESSION_SECRET_KEY}`, // Replace with a strong secret key
//  resave: false,
//  saveUninitialized: true,
 // cookie: { secure: process.env.COOKIE_SECURE } // Set secure to true if using HTTPS
 //  }));


//CORS
const allowedOrigins = [
  `https://assign-tawny.vercel.app`,
  // Add all potential front-end URLs
];


const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));


// Middleware to parse frontend data (Body)
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



//MongoDB connection
connectToDB(`${process.env.MONGODB_URL}`)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.log("some error occured connecting to mongoDB", err)
  })


app.get("/", (req, res) => {
    res.send("Hello, World!"); 
});



app.use("/", userAuth)


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });