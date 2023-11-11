export const routes = {
    dashboard: '/',
    users: '/users',
    products: '/products',
    signIn: '/sign-in',
    report: '/report',

    store: (userId) => `/store/${userId}`,
    productDetail: (productId) => `/detail/${productId}`,
};
