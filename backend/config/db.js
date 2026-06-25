import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jpsoundz');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Ensure that MongoDB is running locally, or update MONGO_URI in backend/.env');
    // We won't exit the process so the developer can still run the server with mock/fallback mechanisms if needed.
    // However, Mongoose will try to reconnect automatically once the server is running.
  }
};

export default connectDB;
