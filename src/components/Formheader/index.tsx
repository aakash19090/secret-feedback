interface IFormheaderProps {
    title: string;
    subtitle?: string;
    note?: string;
}

const Formheader = ({ title, subtitle, note }: IFormheaderProps) => {
    return (
        <div className='form-header text-center'>
            <h1 className='mb-6 text-3xl font-extrabold tracking-tight lg:text-4xl'> {title} </h1>
            <p className='mb-4'> {subtitle} </p>
            {note && (
                <p className='text-xs text-slate-600'>
                    <span className='mr-1 font-semibold underline'>Note:</span>
                    <span>{note}</span>
                </p>
            )}
        </div>
    );
};

export default Formheader;
