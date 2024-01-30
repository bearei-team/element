import {Meta, StoryObj} from '@storybook/react';
import {Card, CardProps} from './Card';

export default {
    title: 'components/Card',
    argTypes: {onPress: {action: 'pressed'}},
    component: Card,
} as Meta<typeof Card>;

export const Filled: StoryObj<CardProps> = {
    args: {
        titleText: 'Title',
    },
};
