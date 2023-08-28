import * as yup from 'yup';

export const schemaEmail = yup.object({
    email: yup
        .string()
        .required()
        .email()
        .matches(/^(?!.*@[^,]*,)/)
        .trim(),
});
export const schemaOtp = yup.object({
    otp: yup
        .string()
        .required()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(5, 'Must be exactly 5 digits')
        .max(5, 'Must be exactly 5 digits'),
});
export const schemaPassword = yup.object({
    password: yup
        .string()
        .required()
        .min(5, 'Must be 5 characters or more')
        .matches(/[@$!%*#?&]+/, 'One special character in @$!%*#?&')
        .matches(/\d+/, 'One number'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
