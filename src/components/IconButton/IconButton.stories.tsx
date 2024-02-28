import {Meta, StoryObj} from '@storybook/react';
import {IconButton, IconButtonProps} from './IconButton';

export default {
    title: 'components/IconButton',
    argTypes: {onPress: {action: 'pressed'}},
    component: IconButton,
} as Meta<typeof IconButton>;

export const Filled: StoryObj<IconButtonProps> = {
    args: {
        supportingText: 'supportingText',
        supportingPosition: 'horizontalEnd',
    },
};

export const Outlined: StoryObj<IconButtonProps> = {
    args: {
        type: 'outlined',
        supportingText: 'supportingText',
        supportingPosition: 'horizontalEnd',
    },
};

export const Standard: StoryObj<IconButtonProps> = {
    args: {
        type: 'standard',
        supportingText: 'supportingText',
        supportingPosition: 'horizontalEnd',
    },
};

export const Tonal: StoryObj<IconButtonProps> = {
    args: {
        type: 'tonal',
        supportingText: 'supportingText',
        supportingPosition: 'horizontalEnd',
    },
};
