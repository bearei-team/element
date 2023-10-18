import {StoryObj, Meta} from '@storybook/react';
import {ButtonProps, Button} from './Button';

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
        disable: true,
    },
};

export const ShowIconFilled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
        icon: 'icon',
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
        disable: true,
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
        disable: true,
    },
};
