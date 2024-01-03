import {Meta, StoryObj} from '@storybook/react';
import {View} from 'react-native';
import {TouchableRipple, TouchableRippleProps} from './TouchableRipple';

export default {
    title: 'components/TouchableRipple',
    component: TouchableRipple,
} as Meta<typeof TouchableRipple>;

export const TouchableRippleButton: StoryObj<TouchableRippleProps> = {
    args: {
        underlayColor: 'black',
        children: (
            <View style={{height: 80, backgroundColor: 'gray', flex: 1}} />
        ),
    },
};
