'use client';
import { Switch } from '@/components/ui/switch';
import { getTextSearchFilter } from '@/redux/selector';
import { toggleActiveProduct } from '@/services/product.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ToggleStatus = ({ productId, active }) => {
    const [toggle, setToggle] = useState(active);
    const textSearch = useSelector(getTextSearchFilter);
    const queryClient = useQueryClient();
    const toggleStatusMutation = useMutation({
        mutationFn: () => {
            return toggleActiveProduct({ productId, active: !active });
        },
        onSuccess(data) {
            if (data.ok) {
                queryClient.invalidateQueries(['products', textSearch]);
                setToggle(!toggle);
            }
        },
        onError(error) {
            toast.error('Can toggle active status.');
        },
    });
    return (
        <Switch
            checked={toggle}
            disabled={toggleStatusMutation?.isLoading}
            onClick={() => {
                toggleStatusMutation.mutate();
            }}
        />
    );
};

export default ToggleStatus;
