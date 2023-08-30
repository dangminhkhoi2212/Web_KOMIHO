import * as yup from 'yup';
const FILE_SIZE = 5 * 1024 * 1024; //5MB
const phoneRegExp = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

const emailYup = yup
    .string()
    .required('Email is a required field')
    .email('Email must be a valid email')
    .matches(/^(?!.*@[^,]*,)/, 'Email must be a valid email')
    .trim();

export const phoneYup = yup
    .string()
    .test('phone', 'Invalid phone number', (phoneNumber) => {
        if (phoneNumber?.length > 0) {
            return phoneRegExp.test(phoneNumber);
        }
        return true;
    });
const nameYup = yup
    .string()
    .required('Name is a required field')
    .max(30, 'Length of name is not over 30 characters');
const passwordYup = yup
    .string()
    .required('Password is a required field')
    .min(5, 'Must be 5 characters or more')
    .matches(/[@$!%*#?&]+/, 'One special character in @$!%*#?&')
    .matches(/\d+/, 'One number');
const confirmPasswordYup = yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match');
const otpYup = yup
    .string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(5, 'Must be exactly 5 digits')
    .max(5, 'Must be exactly 5 digits');
const avatarYup = yup
    .mixed()
    .test('avatar', 'File size too large, max file size is 5 Mb', (file) => {
        if (file[0]) {
            return file[0].size <= FILE_SIZE;
        }
        return true;
    });
////////////////////////////////////////////////////////////////////////
export const emailSchema = yup.object({
    email: emailYup,
});

export const passwordSchema = yup.object({
    password: passwordYup,
    passwordConfirmation: confirmPasswordYup,
});

export const otpSchema = yup.object({
    otp: otpYup,
});

export const profileSchema = yup.object({
    name: nameYup,
    email: emailYup,
    phone: phoneYup,
    avatar: avatarYup,
});
export const loginSchema = yup.object({
    username: yup.string().required('Username is a required field'),
    password: yup.string().required('Password is a required field'),
});
export const registerSchema = yup.object({
    name: nameYup,
    email: emailYup,
    phone: phoneYup,
    password: passwordYup,
    passwordConfirmation: confirmPasswordYup,
});
export const deleteAccountSchema = yup.object({
    password: passwordYup,
});
