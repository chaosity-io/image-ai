import mongoose from "mongoose";
declare global {
    var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local",
    );
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        console.log("Already connected to MongoDB");
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            dbName: 'imaginify', bufferCommands: false
        };
        cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    console.log("Connected to MongoDB");

    return cached.conn;
}

export default connectToDatabase;