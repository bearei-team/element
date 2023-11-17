import {Meta, StoryObj} from '@storybook/react';
import {Text as TextRN} from 'react-native';
import {Button, ButtonProps} from './Button';

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

export const Text: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'text',
    },
};

export const Elevated: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'elevated',
    },
};

export const Tonal: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        type: 'tonal',
    },
};
