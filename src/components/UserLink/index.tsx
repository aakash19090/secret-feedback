'use client';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { memo, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const UserLink = () => {
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const { data: session } = useSession();
    const user = session?.user as User;

    useEffect(() => {
        if (window && user) {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            const profileUrl = `${baseUrl}/u/${user?.username}`;
            setProfileUrl(profileUrl);
        }
    }, [user]);

    const copyToClipBoard = useCallback(async () => {
        if (profileUrl) {
            navigator.clipboard.writeText(profileUrl);
            toast({
                title: 'URL Copied!',
                description: 'Profile URL has been copied to clipboard.',
            });
        }
    }, [profileUrl]);

    return (
        <div>
            <h3 className='text-md mb-4 font-bold lg:text-lg'> Copy Your Unique Link </h3>
            {profileUrl && (
                <div className='mb-8 flex flex-col lg:flex-row'>
                    <input
                        type='text'
                        value={profileUrl}
                        className='input input-bordered w-full bg-slate-100 p-2'
                        disabled
                    />

                    <Button className='mt-5 lg:mt-0' onClick={copyToClipBoard}>
                        Copy
                    </Button>
                </div>
            )}
        </div>
    );
};

export default memo(UserLink);
