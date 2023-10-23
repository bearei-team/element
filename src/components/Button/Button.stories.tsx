import {StoryObj, Meta} from '@storybook/react';
import {ButtonProps, Button} from './Button';
import {Text as TextRN} from 'react-native';

export default {
    title: 'components/Button',
    argTypes: {onPress: {action: 'pressed'}},
    component: Button,
} as Meta<typeof Button>;

export const Filled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
    },
};

export const FilledDisabled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        disabled: true,
    },
};

export const ShowIconFilled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        icon: <TextRN>{'icon'}</TextRN>,
    },
};

export const Outlined: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'outlined',
    },
};

export const OutlinedDisabled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'outlined',
        disabled: true,
    },
};

export const Text: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'text',
    },
};

export const TextDisabled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'text',
        disabled: true,
    },
};

export const Elevated: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'elevated',
    },
};
