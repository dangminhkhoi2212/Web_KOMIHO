import * as yup from 'yup';

const schema = yup
    .object({
        name: yup.string().required('Name is required'),
        price: yup
            .object({
                origin: yup
                    .number()
                    .typeError('Origin must be a number')
                    .required('Origin price is required')
                    .min(0, 'Origin price cannot be negative')
                    .test('is-money', 'Invalid money format', (value) => {
                        // Test if the value is a valid money format (e.g., 1234.56)
                        return /^\d+(\.\d{1,2})?$/.test(value);
                    }),
                percent: yup
                    .number()
                    .typeError('Percent must be a number')
                    .required('Discount percent is required')
                    .min(0, 'Discount percent cannot be negative')
                    .max(100, 'Discount percent cannot exceed 100'),
            })
            .required('Price is required'),
        color: yup.array().of(
            yup.object({
                name: yup.string().required('Color name is required'),
                size: yup.array().of(
                    yup.object({
                        type: yup.string().required('Type is required'),
                        quantity: yup.string().required('Quantity is required'),
                    }),
                ),
            }),
        ),
    })
    .required();

export default schema;
