// backend/config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  console.log("🔍 Loaded MONGO_URI from env?:", !!uri);

  if (!uri) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    return process.exit(1);
  }

  // Mask password when logging
  const maskedUri = uri.replace(/:\/\/.*:.*@/, "://****:****@");
  console.log("🌐 Attempting MongoDB connection to:", maskedUri);

  try {
    await mongoose.connect(uri, {
      // These are passed through to the underlying MongoDB driver
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected successfully to host:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:");
    console.error("   → Message:", error.message);
    console.error("   → Full error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
