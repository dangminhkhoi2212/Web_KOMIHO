'use client';
import { useFormContext, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
const toolbar = dynamic(() => import('./toolbar'));
const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false },
);
import '@/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const FromDescription = () => {
    const { control } = useFormContext();

    return (
        <div className="rounded-xl bg-white flex flex-col gap-2 ">
            <label htmlFor="description" className="text-base font-medium ">
                Description
            </label>
            <div className="border border-dotted border-gray-500  rounded-xl  bg-white">
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => {
                        return (
                            <Editor
                                id="description"
                                toolbar={toolbar}
                                editorState={field.value}
                                wrapperClassName="demo-wrapper"
                                editorClassName="demo-editor"
                                onEditorStateChange={(e) => field.onChange(e)}
                            />
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default FromDescription;
