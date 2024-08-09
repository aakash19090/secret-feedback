import SignUpForm from '@/components/SignUpForm';

const SignUpPage = () => {
    return (
        <main className='flex min-h-screen items-center justify-center bg-gray-800'>
            <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
                <SignUpForm />
            </div>
        </main>
    );
};

export default SignUpPage;
