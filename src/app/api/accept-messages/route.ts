import { authOptions } from '../auth/[...nextauth]/options';
import { getServerSession, User } from 'next-auth';
import { NextRequest } from 'next/server';

import { sendErrorResponse, sendSuccessResponse } from '@/helpers';
import { UserModel } from '@/model/User';

import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return sendErrorResponse(401, 'User not authenticated');
    }

    const userId = user._id;
    const { isAcceptingMessage } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage }, { new: true });
        if (!updatedUser) {
            return sendErrorResponse(401, 'Failed to update user status to accept messages');
        }
        return sendSuccessResponse(200, 'Messages acceptance status updated successfully', updatedUser);
    } catch (error) {
        console.log('Failed to update user status to accept messages', error);
        return sendErrorResponse(500, 'Failed to update user status to accept messages');
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return sendErrorResponse(401, 'User not authenticated');
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return sendErrorResponse(404, 'User not found');
        }

        return sendSuccessResponse(200, 'User found', { isAcceptingMessage: foundUser.isAcceptingMessage });
    } catch (error) {
        console.log('Error to get message acceptance status', error);
        return sendErrorResponse(500, 'Error to get message acceptance status');
    }
}
