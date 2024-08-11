'use client';

import { useCallback, useState } from 'react';

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

    const displayStatus = useCallback(() => {
        if (isUpdatingStatus) {
            return 'Updating Status...';
        }

        return isAcceptingMessages ? (
            <span>
                Accepting Messages - <span className='font-bold text-green-600'>ON</span>
            </span>
        ) : (
            <span>
                Accepting Messages - <span className='font-bold text-destructive'>OFF</span>
            </span>
        );
    }, [isAcceptingMessages, isUpdatingStatus]);

    return (
        <div className='flex items-center'>
            <Switch
                className='cursor-pointer'
                checked={isAcceptingMessages}
                onCheckedChange={handleAcceptMessageSwitch}
                disabled={isUpdatingStatus}
            />
            <span className={cn(`ml-5 inline-block font-semibold`)}>{displayStatus()}</span>
        </div>
    );
};

export default AcceptMessageSwitch;
