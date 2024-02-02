import {Meta, StoryObj} from '@storybook/react';
import {Icon} from '../Icon/Icon';
import {List, ListProps} from './List';

export default {
    title: 'components/List',
    component: List,
} as Meta<typeof List>;

export const Headline: StoryObj<ListProps> = {
    args: {
        close: true,
        defaultActiveKey: 'TitleB',
        data: [
            {
                key: 'TitleA',
                headline: 'TitleA',
                leading: <Icon width={24} height={24} />,
            },
            {
                key: 'TitleB',
                headline: 'TitleB',
                leading: <Icon width={24} height={24} />,
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                key: 'TitleC',
                headline: 'TitleC',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                key: 'TitleD',
                headline: 'TitleD',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
        ],
    },
};
