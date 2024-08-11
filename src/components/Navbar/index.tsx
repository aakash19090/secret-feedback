'use client';

import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Navbar = () => {
    const { data: session } = useSession();

    const user = session?.user as User;

    return (
        <header className='bg-gray-900 py-6 shadow-md'>
            <div className='container'>
                <div className='flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0'>
                    <div className='mb-4 lg:mb-0'>
                        <Link href='/' className='text-2xl font-bold text-white'>
                            Secret Feedback
                        </Link>
                    </div>

                    {session?.user && (
                        <div>
                            <h2 className='font-regular text-white'> {`Welcome, ${user.username || user.email}`} </h2>
                        </div>
                    )}

                    <div>
                        {session ? (
                            <Button size='lg' variant='outline' onClick={() => signOut()}>
                                Logout
                            </Button>
                        ) : (
                            <Link href='/sign-in'>
                                <Button size='lg' variant='outline'>
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
