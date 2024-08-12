// This page is public and can be accessed by anyone. It is used to send messages to a user by anyone

import { cookies } from 'next/headers';

import MessageForm from '@/components/MessageForm';

const UserPage = async ({ params }: { params: { username: string } }) => {
    const { username } = params;

    const nextAuthSessionCookie = cookies().get('next-auth.session-token');

    const checkUserAcceptingMessages = async () => {
        try {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/accept-messages`, {
                method: 'GET',
                headers: {
                    Cookie: `next-auth.session-token=${nextAuthSessionCookie?.value}`,
                },
                cache: 'no-store',
            });

            return await response.json();
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch user messages status');
        }
    };

    const userAcceptingMessages = await checkUserAcceptingMessages();

    const { isAcceptingMessage } = userAcceptingMessages.data;

    return (
        <main>
            <div className='container'>
                <h1 className='mb-8 mt-28 text-center text-2xl font-bold lg:text-3xl'> Public Profile Link </h1>
                <MessageForm username={username} isAcceptingMessage={isAcceptingMessage} />
            </div>
        </main>
    );
};

export default UserPage;
