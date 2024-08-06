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
        const db = await mongoose.connect((process.env.MONGODB_URI as string) || '', {});

        connection.isConnected = db.connections[0].readyState;
        console.log('MongoDB connected Suceesfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default dbConnect;
