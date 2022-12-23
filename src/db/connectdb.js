import mongoose from "mongoose";

function connectDB() {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log(err.message);
  }
}

export default connectDB;
