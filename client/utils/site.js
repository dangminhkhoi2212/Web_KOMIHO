export const clearObject = (ojb) => {
    return Object.entries(ojb).reduce(
        (a, [k, v]) => (v == null ? a : (a[k] = v), a),
        {},
    );
};
export const checkShowProduct = (product) => {
    return product?.lock?.status === false && product.public === true;
};
