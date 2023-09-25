export const getUserId = (state) => state.user._id;
export const getName = (state) => state.user.name;
export const getEmail = (state) => state.user.email;
export const getEmailRecover = (state) => state.recoverAccount.email;

export const getPhone = (state) => state.user.phone;
export const getPickupAddress = (state) => state.user.address?.pickup;
export const getStoreAddress = (state) => state.user.address?.store;
export const getUrlAvatar = (state) => state.user.avatar?.url || '';
export const getAlert = (state) => state.alert;
//filter search
export const getPriceFilter = (state) => state.filterSearch.price;
export const getStoreFilter = (state) => state.filterSearch.store;
export const getPageFilter = (state) => state.filterSearch.page;
export const getLimitFilter = (state) => state.filterSearch.limit;
export const getTextSearchFilter = (state) => state.filterSearch.textSearch;
//list deleted images
export const getListDeletedImages = (state) => state.listDeletedImages.list;
export const getAllowDeletedImages = (state) =>
    state.listDeletedImages.allowDeleted;
// choose product to edit or delete
export const getChooseProduct = (state) => state.chooseProduct.product;
export const getChooseStatus = (state) => state.chooseProduct.status;
// select products in table
export const getSelectProductInTable = (state) => state.selectProductInTable;
