import { authOptions } from '../auth/[...nextauth]/options';
import { getServerSession, User } from 'next-auth';
import { NextRequest } from 'next/server';

import { sendErrorResponse, sendSuccessResponse } from '@/helpers';
import { UserModel } from '@/model/User';
import mongoose from 'mongoose';

import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return sendErrorResponse(401, 'User not authenticated');
    }

    // Converting user._id to mongoose ObjectId, as user._id is convterted to string in token.id in JWT callback in options.ts
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // Using Aggregation Pipeline from MongoDB to get messages of the user in optimized way
        const foundUser = await UserModel.aggregate([
            // Stage 1 - Match the user
            {
                $match: {
                    _id: userId,
                },
            },
            // Stage 2 - Unwind the messages array from the matched user
            {
                $unwind: '$messages',
            },
            // Stage 3 - Sort the messages in descending order of createdAt
            {
                $sort: {
                    'messages.createdAt': -1,
                },
            },
            // Stage 4 - Group the messages back to the user
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages',
                    },
                },
            },
        ]);

        if (!foundUser || foundUser.length === 0) {
            return sendErrorResponse(404, 'User not found');
        }

        return sendSuccessResponse(200, undefined, { messages: foundUser[0].messages });
    } catch (error) {
        console.log('An unexpected error occurred:', error);
        return sendErrorResponse(500, 'Internal server error');
    }
}
