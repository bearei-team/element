import {StoryObj, Meta} from '@storybook/react';
import {TouchableRipple, TouchableRippleProps} from './TouchableRipple';

export default {
    title: 'components/TouchableRipple',
    argTypes: {onPress: {action: 'pressed'}},
    component: TouchableRipple,
} as Meta<typeof TouchableRipple>;

export const Filled: StoryObj<TouchableRippleProps> = {
    args: {},
};
