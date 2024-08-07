import { NextRequest } from 'next/server';

import { sendErrorResponse, sendSuccessResponse } from '@/helpers';
import { IMessage, UserModel } from '@/model/User';

import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
    await dbConnect();
    // Anyone can send the message anonymously, so no need to check for authentication

    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return sendErrorResponse(404, 'User not found');
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessage) {
            return sendErrorResponse(403, 'User is not accepting the messages');
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        };

        user.messages.push(newMessage as IMessage);
        await user.save();

        return sendSuccessResponse(200, 'Message sent successfully');
    } catch (error) {
        console.log('Error sending message', error);
        return sendErrorResponse(500, 'Internal Server Error');
    }
}
