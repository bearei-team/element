import {Meta, StoryObj} from '@storybook/react';
import {Icon as EIIcon} from '../Icon/Icon';
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

export const TextIcon: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        icon: <EIIcon />,
        type: 'text',
    },
};

export const Tonal: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'tonal',
    },
};

export const Elevated: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'elevated',
        disabled: true,
    },
};

export const Link: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        type: 'link',
    },
};

export const Icon: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
        icon: <EIIcon />,
    },
};

export const block: StoryObj<ButtonProps> = {
    args: {
        block: true,
    },
};
