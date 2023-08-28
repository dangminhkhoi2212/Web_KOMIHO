import * as yup from 'yup';
const schema = yup.object({
    email: yup
        .string()
        .required('Email is a required field')
        .email()
        .matches(/^(?!.*@[^,]*,)/)
        .trim(),
    feedback: yup.string().required('Feedback is a required field'),
});
export default schema;
