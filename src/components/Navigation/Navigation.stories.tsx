import {Meta, StoryObj} from '@storybook/react';
import {Navigation, NavigationProps} from './Navigation';

export default {
    title: 'components/Navigation',
    component: Navigation,
} as Meta<typeof Navigation>;

export const NavigationBar: StoryObj<NavigationProps> = {
    args: {
        data: [
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
