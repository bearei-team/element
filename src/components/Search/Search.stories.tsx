import {Meta, StoryObj} from '@storybook/react';
import {Search, SearchProps} from './Search';

export default {
    title: 'components/Search',
    component: Search,
} as Meta<typeof Search>;

export const SearchBar: StoryObj<SearchProps> = {
    args: {
        placeholder: 'Hinted search text',
    },
};
