import {Meta, StoryObj} from '@storybook/react';
import {Icon, IconProps} from './Icon';

export default {
    title: 'components/Icon',
    component: Icon,
} as Meta<typeof Icon>;

export const FaceIcon: StoryObj<IconProps> = {
    args: {
        width: 48,
        height: 48,
    },
};
