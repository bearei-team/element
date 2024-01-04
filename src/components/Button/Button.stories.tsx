import {Meta, StoryObj} from '@storybook/react';
// import {Icon} from '../Icon/Icon';
import {Button, ButtonProps} from './Button';

export default {
    title: 'components/Button',
    argTypes: {onPress: {action: 'pressed'}},
    component: Button,
} as Meta<typeof Button>;

export const Filled: StoryObj<ButtonProps> = {
    args: {
        labelText: 'Label',
    },
};
