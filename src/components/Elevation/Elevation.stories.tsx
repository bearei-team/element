import {Meta, StoryObj} from '@storybook/react';
import {Button} from '../Button/Button';
import {Elevation, ElevationProps} from './Elevation';

export default {
    title: 'components/Elevation',
    component: Elevation,
} as Meta<typeof Elevation>;

export const Level: StoryObj<ElevationProps> = {
    args: {
        level: 0,
        children: <Button label="Elevation" />,
    },
};
