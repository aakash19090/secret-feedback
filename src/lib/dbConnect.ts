import { log } from 'console';

import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Using existing connection from MongoDB');
        return;
    }

    try {
        const db = await mongoose.connect((process.env.MONGODB_URI as string) || '', {
            retryWrites: true, // Enable retryable writes
            w: 'majority' as any, // Set the write concern to 'majority'
            appName: process.env.MONGO_APP_NAME, // Set the application name from environment variables
            dbName: process.env.MONGO_DB_NAME, // Set the database name from environment variables
        });

        connection.isConnected = db.connections[0].readyState;
        console.log('MongoDB connected Suceesfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default dbConnect;
