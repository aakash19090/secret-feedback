'use client';

import { useCallback, useState } from 'react';

import { MessageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

type FormData = z.infer<typeof MessageSchema>;

const MessageForm = ({ username, isAcceptingMessage }: { username: string; isAcceptingMessage: boolean }) => {
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const form = useForm({
        resolver: zodResolver(MessageSchema),
        defaultValues: {
            content: '',
        },
    });

    const { handleSubmit, watch, control, setValue } = form;

    const messageContent = watch('content');

    const handleSendMessage = useCallback(
        async (data: FormData) => {
            setIsSendingMessage(true);

            const formData = {
                content: data.content,
                username,
            };

            try {
                const response = await fetch(`/api/send-message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                toast({
                    title: data.message,
                    variant: data.success ? 'default' : 'destructive',
                });
            } catch (error) {
                console.error(error as Error);

                toast({
                    title: 'Error sending message',
                    description: 'Failed to send message. Please try again.',
                    variant: 'destructive',
                });
            } finally {
                setIsSendingMessage(false);
                setValue('content', '');
            }
        },
        [username, setValue],
    );

    return (
        <div>
            {/* MessageForm */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleSendMessage)} className='mt-10 space-y-8'>
                    <FormField
                        control={control}
                        name='content'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='username'>Send Anonymous message to {username}: </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Write your anonymous message here'
                                        className='resize-none'
                                        rows={5}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='text-center'>
                        <Button
                            type='submit'
                            className='w-36'
                            disabled={!messageContent || isSendingMessage || !isAcceptingMessage}
                        >
                            {isSendingMessage ? <LoaderCircle className='h-6 w-6 animate-spin' /> : 'Send Message'}
                        </Button>

                        {!isAcceptingMessage && <p className='mt-4'>User is not accepting messages at the moment</p>}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default MessageForm;
