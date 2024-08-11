'use client';

import { useCallback, useState } from 'react';

import { IMessage } from '@/model/User';
import { LoaderCircle, Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { getNewMessages } from '@/lib/actions';
import { showFormattedDate } from '@/lib/utils';

const MessageCard = ({ message }: { message: IMessage }) => {
    const [isLoading, setIsLoading] = useState(false);

    const messageId = message._id;

    const handleDeleteMessage = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/delete-message/${messageId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            toast({
                title: data.message,
                'aria-live': 'polite',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
                'aria-live': 'assertive',
            });
        } finally {
            setIsLoading(false);
            await getNewMessages(); // * Server action
        }
    }, [messageId]);

    return (
        <div className='flex items-start justify-between rounded-lg border border-slate-300 p-5 px-5 lg:px-8'>
            <div>
                <h3 className='text-md mb-5 mr-6 font-bold lg:text-xl'> {message.content} </h3>
                <p className='text-sm font-semibold text-gray-500'>{showFormattedDate(message.createdAt)}</p>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive' title='Delete message'>
                        <Trash2 className='h-5 w-5' />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This action cannot be undone. This will permanently delete
                            this message.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMessage}>
                            {isLoading ? <LoaderCircle className='h-4 w-4 animate-spin' /> : 'Continue'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MessageCard;
