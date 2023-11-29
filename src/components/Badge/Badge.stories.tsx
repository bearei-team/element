import {Meta, StoryObj} from '@storybook/react';
import {Badge, BadgeProps} from './Badge';

export default {
    title: 'components/Badge',
    component: Badge,
} as Meta<typeof Badge>;

export const NoneLabel: StoryObj<BadgeProps> = {
    args: {size: 'small'},
};

export const Label: StoryObj<BadgeProps> = {
    args: {size: 'large', label: 3},
};

export const MaxLabel: StoryObj<BadgeProps> = {
    args: {size: 'large', label: 9999},
};
