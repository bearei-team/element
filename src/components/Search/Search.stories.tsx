import {Meta, StoryObj} from '@storybook/react';
import {Search, SearchProps} from './Search';

export default {
    title: 'components/Search',
    component: Search,
} as Meta<typeof Search>;

export const HorizontalNavigationBar: StoryObj<SearchProps> = {
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
