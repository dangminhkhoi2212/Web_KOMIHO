import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { Button } from 'flowbite-react';
import { createCheckOut } from '@/redux/checkoutSlice';
import { getCartList, getUserId } from '@/redux/selector';
import routes from '@/routes';
import { deleteCart, getCart } from '@/services/cart.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { memo, useMemo, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Total = () => {
    const selectProductInCart = useSelector(getCartList);
    const router = useRouter();
    const userId = useSelector(getUserId);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [showModalDelete, setShowModalDelete] = useState(false);

    const total = useMemo(() => {
        if (selectProductInCart.length) {
            const sum = selectProductInCart.reduce((sum, cartItem) => {
                if (cartItem.checked) {
                    const finalPrice = cartItem?.productId?.price?.final;
                    const quantity = cartItem?.select?.quantity;
                    sum += finalPrice * quantity;
                }
                return sum;
            }, 0);
            return sum;
        }
        return 0;
    }, [selectProductInCart]);

    const deleteManyCartMutation = useMutation({
        mutationFn: (cartIds) => {
            return deleteCart({ userId, cartIds });
        },
        onSuccess(data) {
            toast.success('The shopping cart has been successfully deleted.');
            queryClient.invalidateQueries(['cart']);
            setShowModalDelete(false);
        },
        onError(error) {
            toast.error('An error occurred, please try again.');
        },
    });
    const handleDeleteManyCartItem = () => {
        const temp = selectProductInCart.filter(
            (item) => item.checked === true,
        );
        const cartIds = temp.map((item) => item._id);
        deleteManyCartMutation.mutate(cartIds);
    };
    const getCartMutation = useMutation({
        mutationFn: (cartIds) => {
            return getCart({ userId, cartIds });
        },
        onSuccess(data) {
            dispatch(createCheckOut({ cartItems: data }));
            router.push(routes.order);
        },
    });

    const handleCheckOut = async () => {
        const dataStore = selectProductInCart.filter(
            (product) => product.checked,
        );
        const cartIds = dataStore.map((item) => item._id);
        getCartMutation.mutate(cartIds);
    };
    return (
        <div className="px-5 py-4 rounded-md bg-white flex gap-8 justify-between items-center sticky bottom-0 border-t-2 border-accent">
            <div
                className="rounded-md hover:ring-1 p-3"
                role="button"
                onClick={() => {
                    if (selectProductInCart.length === 0) return;
                    setShowModalDelete(true);
                }}>
                <RiDeleteBin6Line className="w-5 h-5" />
            </div>
            {showModalDelete && (
                <Modal
                    label={'DELETE MANY'}
                    handleEvent={() => setShowModalDelete(false)}>
                    <div className="flex flex-col gap-5 relative">
                        {deleteManyCartMutation.isLoading && (
                            <Loading sizeProp={50} />
                        )}
                        <p className="font-medium text-center">
                            {
                                'Do you want to delete all the products you selected ?'
                            }
                        </p>
                        <div className="flex gap-5 justify-center">
                            <Button
                                color="failure"
                                isProcessing={deleteManyCartMutation.isLoading}
                                onClick={() => handleDeleteManyCartItem()}
                                className="bg-red-500 text-white hover:bg-red-600">
                                Yes
                            </Button>
                            <Button
                                color="teal"
                                outline={false}
                                onClick={() => setShowModalDelete(false)}>
                                No
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className="flex gap-5 justify-end items-center">
                <div>
                    <span className="me-3">
                        Total ({' '}
                        {
                            selectProductInCart?.filter(
                                (cartItem) => cartItem.checked === true,
                            ).length
                        }{' '}
                        items):{' '}
                    </span>
                    <NumericFormat
                        value={total}
                        thousandSeparator
                        displayType="text"
                        suffix={' VND'}
                        renderText={(value) => (
                            <span className="text-xl font-medium text-red-500">
                                {value}
                            </span>
                        )}
                    />
                </div>
                <Button
                    pill
                    color="blue"
                    className="bg-primary/80 hover:!bg-primary !border-none focus:!ring-0"
                    onClick={() => handleCheckOut()}
                    isProcessing={getCartMutation.isLoading}>
                    <span>CHECK OUT</span>
                </Button>
            </div>
        </div>
    );
};

export default memo(Total);
