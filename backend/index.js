const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const cors = require("cors");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/url");
const verifyToken = require("./middleware/auth");

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(verifyToken);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const admin = require("firebase-admin");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const urlRoutes = require("./routes/url");
// const verifyToken = require("./middleware/auth");

// dotenv.config();

// // Initialize Firebase Admin SDK
// const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(verifyToken); // Apply Firebase auth middleware to all routes

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// app.use("/", urlRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
