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
            {
                key: 'TitleE',
                headline: 'TitleE',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
        ],
    },
};

export const SearchBarStandard: StoryObj<SearchProps> = {
    args: {
        placeholder: 'Hinted search text',
        type: 'standard',
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
            {
                key: 'TitleE',
                headline: 'TitleE',
                supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
            },
        ],
    },
};
