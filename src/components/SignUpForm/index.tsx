'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { SignUpFormHeaderConstants } from '@/constants';
import { SignUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

import Formheader from '@/components/Formheader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import { IApiResponse } from '@/types/ApiResponse';

type FormData = z.infer<typeof SignUpSchema>;

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState<{
        message: string;
        isValid: boolean | null;
    }>({
        message: '',
        isValid: null,
    });
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const { handleSubmit, control } = form;

    /**
     * Checks the validity of the username by making an API call.
     */
    const checkUsernameValidity = useCallback(async () => {
        if (username) {
            setIsCheckingUsername(true);
            setUsernameMessage({
                message: '',
                isValid: null,
            });

            try {
                const response = await axios.get<IApiResponse>(`/api/check-username?username=${username}`);
                setUsernameMessage({
                    message: response.data.message,
                    isValid: response.data.success,
                });
            } catch (error) {
                const axiosError = error as AxiosError<IApiResponse>;
                setUsernameMessage({
                    message: axiosError.response?.data.message || 'There was a problem checking the username',
                    isValid: false,
                });
            } finally {
                setIsCheckingUsername(false);
            }
        }
    }, [username]);

    useEffect(() => {
        checkUsernameValidity();
    }, [username, checkUsernameValidity]);

    const setDebouncedUsername = useDebounceCallback(setUsername, 500);

    /**
     * Handles the form submission for user sign-up.
     * @param data - The form data containing username, email, and password.
     */
    const handleSignUpUser = async (data: FormData) => {
        setIsSubmittingForm(true);

        try {
            const response = await axios.post<IApiResponse>('/api/sign-up', data);

            if (response.statusText === 'Created') {
                toast({
                    title: 'Sign-up Successful',
                    description: response.data.message,
                });
            }

            router.replace(`/verify/${username}`);
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            const errorMessage =
                axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';

            toast({
                title: 'Sign-up Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSubmittingForm(false);
        }
    };

    const isUsernameValid =
        !isCheckingUsername && usernameMessage.isValid && !/taken/.test(usernameMessage.message.toLowerCase());

    const { title, subtitle, note } = SignUpFormHeaderConstants;

    return (
        <>
            {/* Sign-up Form Header */}
            <Formheader title={title} subtitle={subtitle} note={note} />

            {/* Sign-up Form */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleSignUpUser)} className='mt-10 space-y-8' autoComplete='off'>
                    <FormField
                        control={control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='username'>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter username'
                                        {...field}
                                        autoComplete='off'
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setDebouncedUsername(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                {isCheckingUsername && <LoaderCircle className='animate-spin' />}
                                {usernameMessage.message && username && (
                                    <p
                                        className={cn('text-sm', {
                                            'text-green-600': isUsernameValid,
                                            'text-destructive': !isUsernameValid,
                                        })}
                                    >
                                        {usernameMessage.message}
                                    </p>
                                )}
                                {!username && <FormMessage />}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <FormControl>
                                    <Input type='email' placeholder='Enter email' {...field} autoComplete='off' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='password'>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Enter password'
                                        {...field}
                                        autoComplete='new-password'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button size='lg' className='w-full' type='submit'>
                        {isSubmittingForm ? (
                            <>
                                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </>
                        ) : (
                            `Sign-up`
                        )}
                    </Button>
                </form>
            </Form>

            {/* Sign-up Form Footer */}
            <p className='mt-6 text-center'>
                Already a member?
                <Link href='/sign-in' className='ml-2 text-blue-600 hover:text-blue-800'>
                    Sign in -&gt;
                </Link>
            </p>
        </>
    );
};

export default SignUpForm;
