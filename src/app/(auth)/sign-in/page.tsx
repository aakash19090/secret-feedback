'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function SignInPage() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                <div suppressHydrationWarning>
                    Signed in as {session.user.email} <br />
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            </>
        );
    }
    return (
        <>
            <div suppressHydrationWarning>
                Not signed in <br />
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        </>
    );
}
