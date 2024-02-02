import {Meta, StoryObj} from '@storybook/react';
import {Icon} from '../Icon/Icon';
import {TextField, TextFieldProps} from './TextField';

export default {
    title: 'components/TextField',
    component: TextField,
} as Meta<typeof TextField>;

export const Filled: StoryObj<TextFieldProps> = {
    args: {
        labelText: 'name',
        supportingText: 'supportingText',
    },
};

export const IconTextField: StoryObj<TextFieldProps> = {
    args: {
        labelText: 'name',
        supportingText: 'supportingText',
        leadingIcon: <Icon />,
    },
};
