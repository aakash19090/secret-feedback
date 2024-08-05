import {
    createNewUser,
    generateOTP,
    sendErrorResponse,
    sendSuccessResponse,
    sendVerificationEmail,
    updateExistingUser,
} from '@/helpers';
import { UserModel } from '@/model/User';

import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        // If User already exists and verified, return false as we don't want to signup again
        const existingVerifiedUserByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUserByUsername) {
            return sendErrorResponse('Username is already taken', 400);
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return sendErrorResponse('User is already registered with this email', 400);
            } else {
                await updateExistingUser(existingUserByEmail, password);
            }
        } else {
            // If User doesn't exist, create a new user
            await createNewUser(username, email, password);
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(username, email, generateOTP());
        if (!emailResponse.success) {
            return sendErrorResponse(emailResponse.message, 500);
        }

        return sendSuccessResponse('User registered successfully. Please verify your email', 201);
    } catch (error) {
        console.log('Error registering user', error);
        return sendErrorResponse('Error registering user', 500);
    }
}
