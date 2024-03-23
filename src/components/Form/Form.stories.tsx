// import {Meta} from '@storybook/react';
// import {FC} from 'react';
// import {Button} from '../Button/Button';
// import {TextField} from '../TextField/TextField';
// import {Form, FormProps} from './Form';
// import {ControlProps, FormItemProps} from './FormItem/FormItem';

// export default {
//     title: 'components/Form',
//     component: Form,
// } as Meta<typeof Form>;

// export const FormA: FC<FormProps> = () => {
//     const [form] = Form.useForm();
//     const renderControl = ({value, onValueChange, errorMessage, id, labelText}: ControlProps) => (
//         <TextField
//             key={id}
//             value={value as string}
//             onChangeText={onValueChange}
//             supportingText={errorMessage}
//             error={!!errorMessage}
//             labelText={labelText}
//         />
//     );

//     const items = [
//         {
//             name: 'name',
//             renderControl,
//             rules: [{type: 'string'}],
//             labelText: 'name',
//         },
//         {
//             name: 'age',
//             renderControl,
//             rules: [{type: 'number'}],
//             labelText: 'age',
//         },
//     ] as FormItemProps[];

//     const processFinish = (value: any) => {
//         console.info(value);
//     };

//     const processSubmit = () => {
//         form.submit();
//     };

//     const processReset = () => {
//         form.resetField();
//     };

//     return (
//         <>
//             <Form form={form} onFinish={processFinish} items={items} />
//             <Button labelText="submit" onPress={processSubmit} />
//             <Button labelText="reset" type="outlined" onPress={processReset} />
//         </>
//     );
// };
