import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { VerifyAccountFormConstants } from '@/constants';
import axios, { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import Formheader from '@/components/Formheader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface VerifyAccountFormProps {
    username: string;
}

const VerifyAccountForm = ({ username }: VerifyAccountFormProps) => {
    const { title, subtitle, note } = VerifyAccountFormConstants;
    return (
        <>
            <Formheader title={title} subtitle={subtitle} note={note} />
        </>
    );
};

export default VerifyAccountForm;
