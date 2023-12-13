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
        category: 'icon',
        icon: <Icon />,
    },
};

export const FAB: StoryObj<ButtonProps> = {
    args: {
        category: 'fab',
        icon: <Icon />,
    },
};

export const FABSurface: StoryObj<ButtonProps> = {
    args: {
        category: 'fab',
        fabType: 'surface',
    },
};

export const FABExtended: StoryObj<ButtonProps> = {
    args: {
        category: 'fab',
        fabType: 'surface',
        labelText: 'Label',
        icon: <Icon />,
    },
};
