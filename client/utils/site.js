export const clearObject = (ojb) => {
    return Object.entries(ojb).reduce(
        (a, [k, v]) => (v == null ? a : (a[k] = v), a),
        {},
    );
};
export const isShowProduct = (product) => {
    if (!product) return false;
    return product.public && !product?.lock?.status && product.active;
};
export const isShowUser = (user) => {
    if (!user) return false;
    return user.public && !user?.lock?.status;
};
