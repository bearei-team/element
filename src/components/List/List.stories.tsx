import {Meta, StoryObj} from '@storybook/react';
import {List, ListProps} from './List';

export default {
    title: 'components/List',
    component: List,
} as Meta<typeof List>;

export const Headline: StoryObj<ListProps> = {
    args: {
        close: true,
        data: [
            {
                headline: 'TitleA',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                headline: 'TitleB',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                headline: 'TitleC',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                headline: 'TitleD',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
        ],
    },
};
