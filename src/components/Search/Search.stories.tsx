import {Meta, StoryObj} from '@storybook/react';
import {Search, SearchProps} from './Search';

export default {
    title: 'components/Search',
    component: Search,
} as Meta<typeof Search>;

export const SearchBar: StoryObj<SearchProps> = {
    args: {
        placeholder: 'Hinted search text',
        data: [
            {
                headline: 'TitleA',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                headline: 'TitleB',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                headline: 'TitleC',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
            {
                headline: 'TitleD',
                supportingText:
                    'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
        ],
    },
};
