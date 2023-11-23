import {Meta} from '@storybook/react';
import {FC} from 'react';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {Form, FormProps} from './Form';
import {ControlProps} from './Item/Item';

export default {
    title: 'components/Form',
    component: Form,
} as Meta<typeof Form>;

export const FormA: FC<FormProps> = () => {
    const [form] = Form.useForm<{a: string; b: string}>();
    const renderControl = ({value, onValueChange, errorMessage, id, label}: ControlProps) => (
        <TextField
            key={id}
            value={value as string}
            onChangeText={onValueChange}
            supportingText={errorMessage}
            error={!!errorMessage}
            label={label}
        />
    );

    const processFinish = (value: {a: string; b: string}) => {
        console.info(value);
    };

    const handleSubmit = () => {
        form.submit();
    };

    return (
        <Form form={form} onFinish={processFinish}>
            <Form.Item
                name="name"
                renderControl={renderControl}
                rules={[{type: 'number'}]}
                label="name"
            />

            <Form.Item name="age" renderControl={renderControl} label="age" />

            <Button label="submit" onPress={handleSubmit} />
        </Form>
    );
};
