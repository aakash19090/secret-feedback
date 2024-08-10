'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SignInFormConstants } from '@/constants';
import { SignInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Formheader from '@/components/Formheader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

type FormData = z.infer<typeof SignInSchema>;

const SignInForm = () => {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const { handleSubmit, control } = form;

    const router = useRouter();

    const { title, subtitle } = SignInFormConstants;

    const handleLogin = async (data: FormData) => {
        setIsSubmittingForm(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        console.log('result', result);

        if (result?.error) {
            setIsSubmittingForm(false);
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login Failed',
                    description: 'Incorrect username or password',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        }
        setIsSubmittingForm(false);
        result?.url && router.replace('/dashboard');
    };

    return (
        <>
            {/* Sign-up Form Header */}
            <Formheader title={title} subtitle={subtitle} />

            {/* Sign-up Form */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleLogin)} className='mt-10 space-y-8' autoComplete='off'>
                    <FormField
                        control={control}
                        name='identifier'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email/Username:</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter email or username' autoComplete='off' {...field} />
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
                                <FormLabel>Password:</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Enter password'
                                        autoComplete='new-password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button size='lg' className='w-full' type='submit' disabled={isSubmittingForm}>
                        {isSubmittingForm ? (
                            <>
                                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' /> Signing In
                            </>
                        ) : (
                            `Sign-in`
                        )}
                    </Button>
                </form>
            </Form>

            {/* Sign-up Form Footer */}
            <p className='mt-6 text-center'>
                Not yet registered?
                <Link href='/sign-up' className='ml-2 text-blue-600 hover:text-blue-800'>
                    Sign up -&gt;
                </Link>
            </p>
        </>
    );
};

export default SignInForm;
