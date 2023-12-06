import {Meta, StoryObj} from '@storybook/react';
import {Avatar, AvatarProps} from './Avatar';

export default {
    title: 'components/Avatar',
    component: Avatar,
} as Meta<typeof Avatar>;

export const NoneContentText: StoryObj<AvatarProps> = {
    args: {},
};

export const ContentText: StoryObj<AvatarProps> = {
    args: {labelText: 3},
};

export const MaxContentText: StoryObj<AvatarProps> = {
    args: {labelText: 9999},
};
