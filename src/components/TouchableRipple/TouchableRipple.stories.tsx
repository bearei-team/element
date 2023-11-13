import {Meta, StoryObj} from '@storybook/react';
import {Button} from '../Button/Button';
import {TouchableRipple, TouchableRippleProps} from './TouchableRipple';

export default {
    title: 'components/TouchableRipple',
    argTypes: {onPress: {action: 'pressed'}},
    component: TouchableRipple,
} as Meta<typeof TouchableRipple>;

export const Ripple: StoryObj<TouchableRippleProps> = {
    args: {children: <Button label="Ripple" />},
};
