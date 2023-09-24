const routes = {
    home: '/',
    shirt: '/shirt',
    pants: '/pants',
    newItems: '/newItems',

    login: '/login',
    forgetPassword: '/login/forget-password',
    register: '/register',

    store: (userId) => `/store/${userId}`,
    storeAllProducts: (userId) => `/store/${userId}/all`,
    storeShirt: (userId) => `/store/${userId}/shirt`,
    storePants: (userId) => `/store/${userId}/pants`,

    myAccount: '/manager/my-account',
    profile: '/manager/my-account/profile',
    address: '/manager/my-account/address',
    myStore: '/manager/my-store',
    managerAllProducts: '/manager/my-store/all-products',
    managerAddProduct: '/manager/my-store/add-product',
    password: '/manager/my-account/password',
    myPurchase: '/manager/my-purchases',
    deleteAccount: '/manager/delete-account',

    aboutUs: '/supports/about-us',
    returnPolicy: '/supports/return-policy',
    privacyPolicy: '/supports/privacy-policy',
    termsOfService: '/supports/terms-of-service',

    productDetail: (productId) => `/detail/${productId}`,
};
export default routes;
