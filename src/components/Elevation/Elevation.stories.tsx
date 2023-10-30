import {StoryObj, Meta} from '@storybook/react';
import {ElevationProps, Elevation} from './Elevation';
import {View} from 'react-native';

export default {
    title: 'components/Elevation',
    argTypes: {onPress: {action: 'pressed'}},
    component: Elevation,
} as Meta<typeof Elevation>;

export const ElevationTEST: StoryObj<ElevationProps> = {
    args: {
        level: 3,
        children: <View style={{width: 200, height: 40, backgroundColor: 'red'}} />,
    },
};
