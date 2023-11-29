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
                labelText: 'Label1',

                key: 'name',
            },
            {
                labelText: 'Label2',

                key: 'age',
            },
            {
                labelText: 'Label3',

                key: 'sex',
            },
        ],
    },
};
