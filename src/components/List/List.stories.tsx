import {Meta, StoryObj} from '@storybook/react';
import {List, ListProps} from './List';

export default {
    title: 'components/List',
    component: List,
} as Meta<typeof List>;

export const NoneContentText: StoryObj<ListProps> = {
    args: {size: 'small'},
};

export const ContentText: StoryObj<ListProps> = {
    args: {size: 'large', labelText: 3},
};

export const MaxContentText: StoryObj<ListProps> = {
    args: {size: 'large', labelText: 9999},
};
