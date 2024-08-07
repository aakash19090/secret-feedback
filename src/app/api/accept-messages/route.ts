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
        return sendErrorResponse('User not authenticated', 401);
    }

    const userId = user._id;
    const { isAcceptingMessage } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage }, { new: true });
        if (!updatedUser) {
            return sendErrorResponse('Failed to update user status to accept messages', 401);
        }
        return sendSuccessResponse('Messages acceptance status updated successfully', 200, updatedUser);
    } catch (error) {
        console.log('Failed to update user status to accept messages', error);
        return sendErrorResponse('Failed to update user status to accept messages', 500);
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return sendErrorResponse('User not authenticated', 401);
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return sendErrorResponse('User not found', 404);
        }

        return sendSuccessResponse('User found', 200, { isAcceptingMessage: foundUser.isAcceptingMessage });
    } catch (error) {
        console.log('Error to get message acceptance status', error);
        return sendErrorResponse('Error to get message acceptance status', 500);
    }
}
