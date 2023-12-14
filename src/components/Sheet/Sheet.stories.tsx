import {Meta, StoryObj} from '@storybook/react';
import {Sheet, SheetProps} from './Sheet';

export default {
    title: 'components/Sheet',
    component: Sheet,
} as Meta<typeof Sheet>;

export const NoneContentText: StoryObj<SheetProps> = {
    args: {},
};

export const ContentText: StoryObj<SheetProps> = {
    args: {headlineText: '3'},
};

export const MaxContentText: StoryObj<SheetProps> = {
    args: {headlineText: '9999'},
};
