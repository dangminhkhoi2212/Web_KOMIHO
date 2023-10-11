const routes = {
    home: '/',
    shirt: '/shirt',
    pants: '/pants',
    newItems: '/newItems',

    login: '/login',
    forgetPassword: '/login/forget-password',
    register: '/register',

    store: (userId) => `/store/${userId}`,
    storeAllProducts: (userId) => `/store/${userId}`,
    storeShirt: (userId) => `/store/${userId}/shirt`,
    storePants: (userId) => `/store/${userId}/pants`,

    myAccount: '/my-account',
    profile: '/my-account',
    address: '/my-account/address',
    password: '/my-account/password',
    myPurchase: '/my-account/my-purchases',
    deleteAccount: '/my-account/delete-account',

    myStore: '/my-store',
    managerAllProducts: '/my-store',
    managerAddProduct: '/my-store/add-product',
    managerOrder: '/my-store/order',

    aboutUs: '/supports/about-us',
    returnPolicy: '/supports/return-policy',
    privacyPolicy: '/supports/privacy-policy',
    termsOfService: '/supports/terms-of-service',

    productDetail: (productId) => `/detail/${productId}`,

    cart: '/cart',
    order: '/order',
};
export default routes;
