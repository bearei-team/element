import {Meta, StoryObj} from '@storybook/react';
import {Button} from '../Button/Button';
import {Elevation, ElevationProps} from './Elevation';

export default {
    title: 'components/Elevation',
    component: Elevation,
} as Meta<typeof Elevation>;

export const Elevation0: StoryObj<ElevationProps> = {
    args: {
        level: 0,
        children: <Button label="Elevation0" />,
    },
};

export const Elevation1: StoryObj<ElevationProps> = {
    args: {
        level: 1,
        children: <Button label="Elevation1" />,
    },
};

export const Elevation2: StoryObj<ElevationProps> = {
    args: {
        level: 2,
        children: <Button label="Elevation2" />,
    },
};

export const Elevation3: StoryObj<ElevationProps> = {
    args: {
        level: 3,
        children: <Button label="Elevation3" />,
    },
};

export const Elevation4: StoryObj<ElevationProps> = {
    args: {
        level: 4,
        children: <Button label="Elevation4" />,
    },
};

export const Elevation5: StoryObj<ElevationProps> = {
    args: {
        level: 5,
        children: <Button label="Elevation5" />,
    },
};
