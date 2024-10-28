import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'imaginify', bufferCommands: false
            , serverApi: { version: '1', strict: true, deprecationErrors: true }
        }).then((mongoose) => {
            return mongoose
        })
    console.log('New connection to MongoDB');
    try {
        cached.conn = await cached.promise
    } catch (e) {
        console.log(e);
        cached.promise = null
        throw e
    }
    console.log('Connected to MongoDB');
    return cached.conn;
}