import {Meta, StoryObj} from '@storybook/react';
import {Tab, TabProps} from './Tab';

export default {
    title: 'components/Tab',
    component: Tab,
} as Meta<typeof Tab>;

export const TabHorizontal: StoryObj<TabProps> = {
    args: {
        headerVisible: true,
        data: [
            {
                labelText: 'TabA',
                content: 'A',
            },
            {
                labelText: 'TabBcc',
                content: 'B',
            },
            {
                labelText: 'TabC',
                content: 'C',
            },
            {
                labelText: 'TabD',
                content: 'D',
            },
            {
                labelText: 'TabA',
                content: 'A',
            },
            {
                labelText: 'TabBcc',
                content: 'B',
            },
            {
                labelText: 'TabC',
                content: 'C',
            },
            {
                labelText: 'TabD',
                content: 'D',
            },
        ],
    },
};
