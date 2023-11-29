import {Meta, StoryObj} from '@storybook/react';
import {NavigationBar, NavigationBarProps} from './NavigationBar';

export default {
    title: 'components/NavigationBar',
    component: NavigationBar,
} as Meta<typeof NavigationBar>;

export const HorizontalNavigationBar: StoryObj<NavigationBarProps> = {
    args: {
        layout: 'horizontal',
        menus: [
            {
                label: 'Label1',
                icon: <></>,
                key: 'name',
            },
            {
                label: 'Label2',
                icon: <></>,
                key: 'age',
            },
            {
                label: 'Label3',
                icon: <></>,
                key: 'sex',
            },
        ],
    },
};
