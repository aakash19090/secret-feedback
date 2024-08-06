import { NextRequest } from 'next/server';

import { sendErrorResponse, sendSuccessResponse } from '@/helpers';
import { UserModel } from '@/model/User';
import { VerifySchema } from '@/schemas/verifySchema';

import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { username, code } = await req.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return sendErrorResponse('User not found', 404);
        }

        // Validate VerifyCode with Zod schema
        const validationResult = VerifySchema.safeParse({ code });

        if (!validationResult.success) {
            const codeErrors = validationResult.error.format().code?._errors || [];
            const errorMessage =
                codeErrors.length > 0 ? codeErrors.join(', ') : 'Invalid code! Verification code must be of 6 digits';
            return sendErrorResponse(errorMessage, 400);
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = user.verifyCodeExpiry > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return sendSuccessResponse('Account verified successfully', 200);
        } else if (!isCodeNotExpired) {
            return sendErrorResponse('Verification code has expired. Please sign up again to get a new code', 400);
        } else {
            return sendErrorResponse('Invalid code! Please enter the correct verification code', 400);
        }
    } catch (error) {
        console.log('Error verifying code', error);
        return sendErrorResponse('Error verifying code', 500);
    }
}
