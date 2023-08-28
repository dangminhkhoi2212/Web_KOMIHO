import { useState } from 'react';

import { Label, Textarea } from 'flowbite-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema';
import InputCustom from '@/components/InputCustom';
import TextareaCustom from '@/components/TextareaCustom';
import Loading from '@/components/Loading';
const Feedback = () => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState(false);

    const sendFeedback = (data) => {
        try {
            console.log('🚀 ~ file: index.jsx:19 ~ sendFeedback ~ data:', data);
        } catch (error) {}
    };
    return (
        <form
            onSubmit={handleSubmit(sendFeedback)}
            className="flex flex-col gap-3">
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <InputCustom
                        id="email"
                        label="Email"
                        placeholder="Email"
                        onChange={(e) => field.onChange(e.target.value)}
                        helperText={errors.email?.message}
                        color={errors.email?.message ? 'failure' : 'gray'}
                    />
                )}
            />
            <div className="flex flex-col gap-2 mt-2">
                <div className="max-w-md" id="textarea">
                    <div className="mb-2 block">
                        <Label htmlFor="comment" value="Your message" />
                    </div>
                    <Controller
                        name="feedback"
                        control={control}
                        render={({ field }) => (
                            <TextareaCustom
                                id="comment"
                                placeholder="Leave a comment..."
                                rows={4}
                                helperText={errors.feedback?.message}
                                color={
                                    errors.feedback?.message
                                        ? 'failure'
                                        : 'gray'
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                </div>
            </div>
            <button
                type="submit"
                className="h-12 rounded-xl text-white bg-primary hover:bg-accent transition ease-in-out duration-500 shadow-sm shadow-accent relative">
                {loading ? (
                    <Loading
                        loadingStatus={loading}
                        colorProp={'#ffffff'}
                        sizeProp={20}
                    />
                ) : (
                    'Next'
                )}
            </button>
        </form>
    );
};

export default Feedback;
