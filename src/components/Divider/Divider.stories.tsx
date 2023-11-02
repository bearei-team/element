import {StoryObj, Meta} from '@storybook/react';
import {Divider, DividerProps} from './Divider';

export default {
    title: 'components/Divider',
    component: Divider,
} as Meta<typeof Divider>;

export const DividerHorizontalLarge: StoryObj<DividerProps> = {
    args: {size: 'large'},
};

export const DividerHorizontalMedium: StoryObj<DividerProps> = {
    args: {size: 'medium'},
};

export const DividerHorizontalSmall: StoryObj<DividerProps> = {
    args: {size: 'small'},
};

export const DividerSubheader: StoryObj<DividerProps> = {
    args: {layout: 'horizontal', subheader: 'Subheader'},
};

export const DividerVerticalLarge: StoryObj<DividerProps> = {
    args: {size: 'large', layout: 'vertical'},
};

export const DividerVerticalMedium: StoryObj<DividerProps> = {
    args: {size: 'medium', layout: 'vertical'},
};

export const DividerVerticalSmall: StoryObj<DividerProps> = {
    args: {size: 'small', layout: 'vertical'},
};
