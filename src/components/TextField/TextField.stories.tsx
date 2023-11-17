import {Meta, StoryObj} from '@storybook/react';
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

export const FilledPlaceholder: StoryObj<TextFieldProps> = {
    args: {
        label: 'Label',
        supportingText: 'supportingText',
        placeholder: 'Placeholder',
    },
};

export const FilledError: StoryObj<TextFieldProps> = {
    args: {
        label: 'Label',
        supportingText: 'supportingText',
        error: true,
    },
};

export const FilledDisabled: StoryObj<TextFieldProps> = {
    args: {
        label: 'Label',
        supportingText: 'supportingText',
        disabled: true,
    },
};
