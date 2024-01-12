import {Meta, StoryObj} from '@storybook/react';
import {TextField, TextFieldProps} from './TextField';

export default {
    title: 'components/TextField',
    component: TextField,
} as Meta<typeof TextField>;

export const Filled: StoryObj<TextFieldProps> = {
    args: {
        labelText: '姓名',
        supportingText: 'supportingText',
    },
};
