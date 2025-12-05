// backend/config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected (Atlas)");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // In Render it's better to crash so the service restarts
    process.exit(1);
  }
};

module.exports = connectDB;
