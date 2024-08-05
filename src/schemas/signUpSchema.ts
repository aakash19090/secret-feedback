import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(3, 'Username must be atleast 3 characters')
    .max(20, 'Username must be atmost 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must contain only alphanumeric characters and underscore');

export const emailValidation = z.string().email('Invalid email address');

export const SignUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: z.string().min(6, { message: 'Password must be atleast 6 characters' }),
});
