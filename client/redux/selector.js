export const getUserId = (state) => state.user._id;
export const getName = (state) => state.user.name;
export const getEmail = (state) => state.user.email;
export const getEmailRecover = (state) => {
    console.log('🚀 ~ file: selector.js:5 ~ getEmailRecover ~ state:', state);

    return state.recoverAccount.email;
};
export const getPhone = (state) => state.user.phone;
export const getPickupAddress = (state) => state.user.address?.pickup;
export const getStoreAddress = (state) => state.user.address?.store;
export const getUrlAvatar = (state) => state.user.avatar?.url || '';
export const getAlert = (state) => state.alert;
