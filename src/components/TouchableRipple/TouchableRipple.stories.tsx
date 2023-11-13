import {Meta, StoryObj} from '@storybook/react';
import {View} from 'react-native';
import {TouchableRipple, TouchableRippleProps} from './TouchableRipple';

export default {
    title: 'components/TouchableRipple',
    argTypes: {onPress: {action: 'pressed'}},
    component: TouchableRipple,
} as Meta<typeof TouchableRipple>;

export const Ripple: StoryObj<TouchableRippleProps> = {
    args: {
        children: <View style={{width: 200, height: 40, backgroundColor: 'red'}} />,
        underlayColor: '#000000',
    },
};
