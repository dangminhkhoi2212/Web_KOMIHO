import { Component, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useFormContext, Controller, useController } from 'react-hook-form';

import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '@/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import toolbar from './toolbar';
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
