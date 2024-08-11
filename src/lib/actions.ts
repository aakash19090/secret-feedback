'use server';

import { revalidateTag } from 'next/cache';

export const getNewMessages = async () => {
    revalidateTag('messages');
};
