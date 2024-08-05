// src/helpers/userHelpers.ts

import { UserModel, type IUser } from '@/model/User';
import bcrypt from 'bcryptjs';

import { resend } from '@/lib/resend';

import type { IApiResponse } from '@/types/ApiResponse';

import VerificationEmail from '../../emails/verificationEmail';

// ===============================================================================================================
export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<IApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Secret Feedback | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: 'Verification email sent successfully' };
    } catch (emailError) {
        console.log('Error sending verification email', emailError);
        return { success: false, message: 'Failed to send verification email' };
    }
}

// ===============================================================================================================
export function generateOTP() {
    // * Generates random 6 digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===============================================================================================================
export function setExpiryDateByHours(hours: number) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hours);
    return expiryDate;
}

// ===============================================================================================================
export async function createNewUser(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        isAcceptingMessages: true,
        verifyCode: generateOTP(),
        verifyCodeExpiry: setExpiryDateByHours(1), // 1 hour from now,
        messages: [],
    });
    await newUser.save();
    return newUser;
}

// ===============================================================================================================
export async function updateExistingUser(existingUser: IUser, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    existingUser.verifyCode = generateOTP();
    existingUser.verifyCodeExpiry = setExpiryDateByHours(1);
    await existingUser.save();
}

// ===============================================================================================================
export function sendErrorResponse(message: string, status: number) {
    return Response.json({ success: false, message }, { status });
}

// ===============================================================================================================
export function sendSuccessResponse(message: string, status: number) {
    return Response.json({ success: true, message }, { status });
}
