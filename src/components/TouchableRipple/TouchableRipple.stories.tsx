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
        underlayColor: '#ce1616',
        children: (
            <View style={{height: 80, width: 200, backgroundColor: 'gray'}} />
        ),
    },
};

export const DefaultActiveRipple: StoryObj<TouchableRippleProps> = {
    args: {
        defaultActive: true,
        underlayColor: '#ce1616',
        children: <View style={{height: 80, width: '100%'}} />,
    },
};
