import Navbar from '@/components/Navbar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default AppLayout;
