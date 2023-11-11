export const clearOject = (ojb) => {
    return Object.entries(ojb).reduce(
        (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
        {},
    );
};
