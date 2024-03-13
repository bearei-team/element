import {Meta, StoryObj} from '@storybook/react';
import {View} from 'react-native';
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
        activeKey: 'TitleA',
        data: [
            {
                key: 'TitleA',
                headline: 'TitleA',
            },
            {
                key: 'TitleB',
                headline: 'TitleB',
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

export const Size: StoryObj<ListProps> = {
    args: {
        close: true,
        defaultActiveKey: 'TitleB',
        activeKey: 'TitleA',
        size: 'small',
        gap: 8,
        shape: 'extraSmall',
        data: [
            {
                key: 'TitleA',
                headline: '怪物总选举 - 第10名~第1名',
                leading: <View style={{backgroundColor: 'red', width: 18, height: 18}}></View>,
            },
            {
                key: 'TitleB',
                headline: 'TitleB',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
                leading: <Icon name="addHome" renderStyle={{width: 18, height: 18}} />,
            },
            {
                key: 'TitleC',
                headline: 'TitleC',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
                leading: <Icon name="addHome" renderStyle={{width: 18, height: 18}} />,
            },
            {
                key: 'TitleD',
                headline: 'TitleD',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
                leading: <Icon name="addHome" renderStyle={{width: 18, height: 18}} />,
            },
        ],
    },
};
