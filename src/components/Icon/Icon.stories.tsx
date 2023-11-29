import {Meta, StoryObj} from '@storybook/react';
import {Icon, IconProps} from './Icon';

export default {
    title: 'components/Icon',
    component: Icon,
} as Meta<typeof Icon>;

export const Filled: StoryObj<IconProps> = {
    args: {
        type: 'filled',
        category: 'image',
        name: 'lens',
    },
};

export const Outlined: StoryObj<IconProps> = {
    args: {
        type: 'outlined',
        category: 'image',
        name: 'lens',
    },
};
