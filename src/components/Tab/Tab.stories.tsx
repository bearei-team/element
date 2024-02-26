import {Meta, StoryObj} from '@storybook/react';
import {Tab, TabProps} from './Tab';

export default {
    title: 'components/Tab',
    component: Tab,
} as Meta<typeof Tab>;

export const TabHorizontal: StoryObj<TabProps> = {
    args: {
        defaultActiveKey: 'C',
        activeKey: 'A',
        data: [
            {
                labelText: 'TabA',
                content: 'A',
                key: 'A',
            },
            {
                labelText: 'Specifications',
                content: 'B',
                key: 'B',
            },
            {
                labelText: 'TabC',
                content: 'C',
                key: 'C',
            },
            {
                labelText: 'TabD',
                content: 'D',
                key: 'D',
            },
        ],
    },
};
