import * as yup from 'yup';
const schema = yup
    .object({
        username: yup.string().required().trim(),
        password: yup.string().required(),
    })
    .required();
export default schema;
