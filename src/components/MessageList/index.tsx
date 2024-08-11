'use client';

import { useState } from 'react';

import { IMessage } from '@/model/User';
import { Loader2, RefreshCcw } from 'lucide-react';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { getNewMessages } from '@/lib/actions';

const MessageList = ({ messages }: { messages: IMessage[] }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = async () => {
        setIsLoading(true);
        await getNewMessages(); // Server action
        setIsLoading(false);

        toast({
            title: 'Refreshed Messages',
            description: `You're seeing the latest messages.`,
        });
    };

    return (
        <div>
            {/* Refresh Button */}
            <div className='mb-8'>
                <Button className='mt-4' variant='outline' onClick={handleRefresh}>
                    {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCcw className='h-4 w-4' />}
                </Button>
            </div>

            {/* Messages List */}
            <div className='grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-2'>
                {messages &&
                    messages.length > 0 &&
                    messages.map((message) => <MessageCard key={message._id as React.Key} message={message} />)}
            </div>
        </div>
    );
};

export default MessageList;
