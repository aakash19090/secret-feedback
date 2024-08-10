'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { VerifyAccountFormConstants } from '@/constants';
import { VerifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Formheader from '@/components/Formheader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';

import { IApiResponse } from '@/types/ApiResponse';

interface VerifyAccountFormProps {
    username: string;
}

type FormData = z.infer<typeof VerifySchema>;

const VerifyAccountForm = ({ username }: VerifyAccountFormProps) => {
    const [isCheckingCode, setIsCheckingCode] = useState(false);

    const form = useForm({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
            code: '',
        },
    });

    const { handleSubmit, control } = form;
    const router = useRouter();

    const { title, subtitle, note } = VerifyAccountFormConstants;

    const handleOTPSubmit = async (data: FormData) => {
        setIsCheckingCode(true);
        try {
            const response = await axios.post<IApiResponse>(`/api/verify-code`, {
                username,
                code: data.code,
            });
            toast({
                title: 'Verification successful',
                description: response.data.message,
            });
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<IApiResponse>;
            toast({
                title: 'Verification failed',
                description: axiosError.response?.data.message || 'An error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsCheckingCode(false);
        }
    };

    return (
        <>
            <Formheader title={title} subtitle={subtitle} note={note} />

            <Form {...form}>
                <form onSubmit={handleSubmit(handleOTPSubmit)} className='mt-10 space-y-8'>
                    <FormField
                        control={control}
                        name='code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code:</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription className='text-xs'>
                                    Please enter 6 digit verification code sent to your email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button size='lg' className='w-full' type='submit' disabled={isCheckingCode}>
                        {isCheckingCode ? (
                            <>
                                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                                Verifying...
                            </>
                        ) : (
                            'Submit Code'
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default VerifyAccountForm;
