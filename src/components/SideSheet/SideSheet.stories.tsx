import {Meta, StoryObj} from '@storybook/react';
import {SideSheet, SideSheetProps} from './SideSheet';

export default {
    title: 'components/SideSheet',
    component: SideSheet,
} as Meta<typeof SideSheet>;

export const SheetSide: StoryObj<SideSheetProps> = {
    args: {visible: true},
};

export const SheetSideFooter: StoryObj<SideSheetProps> = {
    args: {footer: true, visible: true},
};
