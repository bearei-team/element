import {StoryObj, Meta} from '@storybook/react';
import {TextField, TextFieldProps} from './TextField';

export default {
    title: 'components/TextField',
    component: TextField,
} as Meta<typeof TextField>;

export const Filled: StoryObj<TextFieldProps> = {
    args: {
        label: 'Label',
        supportingText: 'supportingText',
    },
};

export const FilledError: StoryObj<TextFieldProps> = {
    args: {
        label: 'Label',
        supportingText: 'supportingText',
        error: true,
    },
};
