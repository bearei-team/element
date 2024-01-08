import {Meta, StoryObj} from '@storybook/react';
import {List, ListProps} from './List';

export default {
    title: 'components/List',
    component: List,
} as Meta<typeof List>;

export const Headline: StoryObj<ListProps> = {
    args: {
        close: true,
        activeKey: 'TitleB',
        data: [
            {
                key: 'TitleA',
                headline: 'TitleA',
            },
            {
                key: 'TitleB',
                headline: 'TitleB',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                key: 'TitleC',
                headline: 'TitleC',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                key: 'TitleD',
                headline: 'TitleD',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
        ],
    },
};
