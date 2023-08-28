import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '@/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const FromDescription = () => {
    return (
        <div className="rounded-xl bg-white p-5">
            <h1 className="inline-block text-lg font-medium my-6">
                Description
            </h1>
            <div className="border border-dotted border-gray-500  overflow-hidden rounded-xl px-5 pb-5">
                <Editor />
            </div>
        </div>
    );
};

export default FromDescription;
