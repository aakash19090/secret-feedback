import SignInForm from '@/components/SignInForm';

const SignInPage = async ({ params }: { params: { username: string } }) => {
    const { username } = params;
    return (
        <main className='flex min-h-screen items-center justify-center bg-gray-800'>
            <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
                <SignInForm />
            </div>
        </main>
    );
};

export default SignInPage;
