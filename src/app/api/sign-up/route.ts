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
            return sendErrorResponse(400, 'Username is already taken');
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verificationCode = generateOTP();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return sendErrorResponse(400, 'User is already registered with this email');
            } else {
                await updateExistingUser(existingUserByEmail, username, password, verificationCode);
            }
        } else {
            // If User doesn't exist, create a new user
            await createNewUser(username, email, password, verificationCode);
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(username, email, verificationCode);
        if (!emailResponse.success) {
            return sendErrorResponse(500, emailResponse.message);
        }

        return sendSuccessResponse(201, 'User registered successfully. Please verify your email');
    } catch (error) {
        console.log('Error registering user', error);
        return sendErrorResponse(500, 'Error registering user');
    }
}
