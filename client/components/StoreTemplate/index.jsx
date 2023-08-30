'use client';
import React from 'react';
import AvatarText from '@/components/Avatar';

import { getUser } from '@/services/user.service';

const StoreTemplate = ({ userId, children }) => {
    return (
        <div>
            <div>
                <div>
                    <div>
                        <AvatarText />
                    </div>
                </div>
                <div>
                    <p>{userId}</p>
                </div>
            </div>
        </div>
    );
};

export default StoreTemplate;
