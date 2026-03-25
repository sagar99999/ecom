import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) throw new Error("Missing MONGO_URI in environment");

// --- Type for our mongoose cache ---
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// --- Extend NodeJS global type ---
declare global {
    var mongoose: MongooseCache;
}

// --- Initialize cached, only if it doesn't exist ---
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export default async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// --- Assign cached to global only if not already set ---
if (!global.mongoose) {
    global.mongoose = cached;
}