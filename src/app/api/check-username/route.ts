import { NextRequest, NextResponse } from 'next/server';

import { sendErrorResponse, sendSuccessResponse } from '@/helpers';
import { UserModel } from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';
import { z } from 'zod';

import dbConnect from '@/lib/dbConnect';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const searchParams = req.nextUrl.searchParams;
        const queryParam = {
            username: searchParams.get('username'),
        };

        // Validate query params with Zod schema
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            const errorMessage = usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid username';
            return sendErrorResponse(errorMessage, 400);
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return sendErrorResponse('Username is already taken', 400);
        }

        return sendSuccessResponse('Username is available', 200);
    } catch (error) {
        console.log('Error checking username', error);
        return sendErrorResponse('Error checking username', 500);
    }
}
