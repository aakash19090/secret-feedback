'use client';

import { useSession } from 'next-auth/react';

const DashboardPage = () => {
    const { data: session, status } = useSession();

    console.log('session', session);

    return <div>DashboardPage</div>;
};

export default DashboardPage;
