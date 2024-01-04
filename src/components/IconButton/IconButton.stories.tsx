import {Meta, StoryObj} from '@storybook/react';
import {IconButton, IconButtonProps} from './IconButton';

export default {
    title: 'components/IconButton',
    argTypes: {onPress: {action: 'pressed'}},
    component: IconButton,
} as Meta<typeof IconButton>;

export const Filled: StoryObj<IconButtonProps> = {
    args: {},
};

export const Outlined: StoryObj<IconButtonProps> = {
    args: {
        type: 'outlined',
    },
};

export const Standard: StoryObj<IconButtonProps> = {
    args: {
        type: 'standard',
    },
};

export const Tonal: StoryObj<IconButtonProps> = {
    args: {
        type: 'tonal',
    },
};
