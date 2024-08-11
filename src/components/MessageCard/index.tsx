'use client';

import React from 'react';

import { IMessage } from '@/model/User';
import { X } from 'lucide-react';

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

import { showFormattedDate } from '@/lib/utils';

const MessageCard = ({ message }: { message: IMessage }) => {
    const handleDeleteMessage = async () => {
        // Delete message and revalidate here from server action
    };

    return (
        <div className='flex items-start justify-between rounded-lg border border-slate-300 p-5 px-8'>
            <div>
                <h3 className='mb-5 mr-6 text-xl font-bold'> {message.content} </h3>
                <p className='text-sm font-semibold text-gray-500'>{showFormattedDate(message.createdAt)}</p>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive'>
                        <X className='h-5 w-5' />
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
                        <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MessageCard;
