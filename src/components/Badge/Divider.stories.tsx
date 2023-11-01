import {StoryObj, Meta} from '@storybook/react';
import {Badge, BadgeProps} from './Badge';

export default {
    title: 'components/Badge',
    component: Badge,
} as Meta<typeof Badge>;

export const BadgeLarge: StoryObj<BadgeProps> = {
    args: {size: 'large', label: 17},
};

export const BadgeSmall: StoryObj<BadgeProps> = {
    args: {size: 'small'},
};
