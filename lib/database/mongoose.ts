import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

interface MongoosConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongoosConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGODB_URL) throw new Error("Please define a MongoDB connection");

    const opts = {
        dbName: 'imaginify',
        bufferCommands: false,
    }
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL!, opts);

    cached.conn = await cached.promise;

    console.log('Connected to MongoDB');
    return cached.conn;

}