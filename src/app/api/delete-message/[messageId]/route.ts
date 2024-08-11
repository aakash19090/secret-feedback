import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession, User } from 'next-auth';
import { NextRequest } from 'next/server';

import { sendErrorResponse, sendSuccessResponse } from '@/helpers';
import { UserModel } from '@/model/User';

import dbConnect from '@/lib/dbConnect';

export async function DELETE(req: NextRequest, { params }: { params: { messageId: string } }) {
    await dbConnect();

    const messageId = params.messageId;
    const session = await getServerSession(authOptions);

    const user = session?.user as User;

    if (!session || !user) {
        return sendErrorResponse(401, 'User not authenticated');
    }

    try {
        const updateResult = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageId } } });

        if (updateResult.modifiedCount === 0) {
            return sendErrorResponse(404, 'Message not found or already deleted');
        }

        return sendSuccessResponse(200, 'Message deleted');
    } catch (error) {
        console.error('Error deleting message:', error);
        return sendErrorResponse(500, 'Error deleting message');
    }
}
