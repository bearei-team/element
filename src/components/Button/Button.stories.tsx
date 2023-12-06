import {Meta, StoryObj} from '@storybook/react';
import {Icon} from '../Icon/Icon';
import {Button, ButtonProps} from './Button';

export default {
    title: 'components/Button',
    argTypes: {onPress: {action: 'pressed'}},
    component: Button,
} as Meta<typeof Button>;

export const Filled: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
    },
};

export const Outlined: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'outlined',
    },
};

export const Text: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'text',
    },
};

export const Elevated: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'elevated',
    },
};

export const Tonal: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'tonal',
    },
};

export const IconFilled: StoryObj<ButtonProps> = {
    args: {
        category: 'iconButton',
        icon: <Icon />,
    },
};
