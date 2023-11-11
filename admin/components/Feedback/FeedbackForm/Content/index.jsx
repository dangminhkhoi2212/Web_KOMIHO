import TextareaCustom from '@/components/TextareaCustom';
import { Controller, useWatch } from 'react-hook-form';

const Content = ({ control }) => {
    const content = useWatch({ name: 'content' });
    return (
        <>
            <Controller
                name="content"
                control={control}
                render={({ field }) => {
                    return (
                        <TextareaCustom
                            id="content"
                            rows={3}
                            label="Content"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            placeholder="Your comment..."
                        />
                    );
                }}
            />
            <p className="text-gray-400">{content.length}/500</p>
        </>
    );
};

export default Content;
