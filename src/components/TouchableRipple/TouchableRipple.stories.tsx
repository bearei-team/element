import {StoryObj, Meta} from '@storybook/react';
import {TouchableRipple} from './TouchableRipple';
import {TouchableRippleProps} from './BaseTouchableRipple';

export default {
    title: 'components/TouchableRipple',
    argTypes: {onPress: {action: 'pressed'}},
    component: TouchableRipple,
} as Meta<typeof TouchableRipple>;

export const Filled: StoryObj<TouchableRippleProps> = {
    args: {},
};
