import {Meta, StoryObj} from '@storybook/react';
import {Badge, BadgeProps} from './Badge';

export default {
    title: 'components/Badge',
    component: Badge,
} as Meta<typeof Badge>;

export const NoneContentText: StoryObj<BadgeProps> = {
    args: {size: 'small'},
};

export const ContentText: StoryObj<BadgeProps> = {
    args: {size: 'large', contentText: 3},
};

export const MaxContentText: StoryObj<BadgeProps> = {
    args: {size: 'large', contentText: 9999},
};
