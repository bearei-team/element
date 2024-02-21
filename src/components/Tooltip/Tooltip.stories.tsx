import {Meta, StoryObj} from '@storybook/react';
import {IconButton} from '../IconButton/IconButton';
import {Tooltip, TooltipProps} from './Tooltip';

export default {
    title: 'components/Tooltip',
    argTypes: {onPress: {action: 'pressed'}},
    component: Tooltip,
} as Meta<typeof Tooltip>;

export const Plain: StoryObj<TooltipProps> = {
    args: {
        children: <IconButton />,
        supportingText: 'Supporting Text',
    },
};
