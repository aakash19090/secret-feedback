import { cookies } from 'next/headers';

import { IMessage } from '@/model/User';

import AcceptMessageSwitch from '@/components/AcceptMessageSwitch';
import MessageList from '@/components/MessageList';
import { Separator } from '@/components/ui/separator';
import UserLink from '@/components/UserLink';

const DashboardPage = async () => {
    // 😮‍💨 Scratched some head for this:
    // This is how we validate session on the server side page through cookies.
    const nextAuthSessionToken = cookies().get('next-auth.session-token');

    const getUserMessages = async () => {
        try {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/get-messages`, {
                method: 'GET',
                headers: {
                    Cookie: `next-auth.session-token=${nextAuthSessionToken?.value}`,
                },
                cache: 'no-store',
                next: {
                    tags: ['messages'], // Tag added to revalidate the cache again to fetch fresh messages
                },
            });

            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch user messages');
        }
    };

    const checkUserAcceptingMessages = async () => {
        try {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/accept-messages`, {
                method: 'GET',
                headers: {
                    Cookie: `next-auth.session-token=${nextAuthSessionToken?.value}`,
                },
                cache: 'no-store',
            });

            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch user messages status');
        }
    };

    const userMessagesData = await getUserMessages();

    const userAcceptingMessages = await checkUserAcceptingMessages();

    const { isAcceptingMessage } = userAcceptingMessages.data;

    const messages = userMessagesData?.data?.messages || [];

    return (
        <main>
            <div className='container'>
                <div className='my-10 lg:mx-24 lg:my-16'>
                    <h1 className='mb-8 text-2xl font-bold lg:text-3xl'>User Dashboard</h1>
                    <UserLink />
                    <AcceptMessageSwitch isAcceptingMessage={isAcceptingMessage} />
                    <Separator className='my-8 bg-slate-500' />
                    <MessageList messages={messages} />
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
