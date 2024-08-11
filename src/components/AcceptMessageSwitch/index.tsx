'use client';

import { useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import { IApiResponse } from '@/types/ApiResponse';

const AcceptMessageSwitch = ({ isAcceptingMessage }: { isAcceptingMessage: boolean }) => {
    const [isAcceptingMessages, setIsAcceptingMessages] = useState(isAcceptingMessage);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleAcceptMessageSwitch = async () => {
        setIsUpdatingStatus(true);
        try {
            const response = await fetch('/api/accept-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isAcceptingMessage: !isAcceptingMessage }),
            });

            const data: IApiResponse = await response.json();

            setIsAcceptingMessages(!isAcceptingMessages);
            toast({
                title: data.message,
                variant: 'default',
            });
        } catch (error) {
            console.error('Error while changing message acceptance status', error);
            toast({
                title: 'Error',
                description: 'An error occurred while updating the message status.',
                variant: 'destructive',
            });
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <div className='flex items-center'>
            <Switch
                checked={isAcceptingMessages}
                onCheckedChange={handleAcceptMessageSwitch}
                disabled={isUpdatingStatus}
            />
            <span
                className={cn(`ml-5 inline-block font-semibold`, {
                    'text-green-600': isAcceptingMessages && !isUpdatingStatus,
                    'text-destructive': !isAcceptingMessages && !isUpdatingStatus,
                })}
            >
                {!isUpdatingStatus
                    ? isAcceptingMessages
                        ? 'Accepting Messages - ON'
                        : 'Accepting Messages - OFF'
                    : 'Updating Status...'}
            </span>
        </div>
    );
};

export default AcceptMessageSwitch;
