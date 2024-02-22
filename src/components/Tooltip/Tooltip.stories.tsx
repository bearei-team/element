import {Meta, StoryObj} from '@storybook/react';
import {Icon} from '../Icon/Icon';
import {Tooltip, TooltipProps} from './Tooltip';

export default {
    title: 'components/Tooltip',
    argTypes: {onPress: {action: 'pressed'}},
    component: Tooltip,
} as Meta<typeof Tooltip>;

export const PlainVerticalEnd: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        position: 'verticalEnd',
    },
};

export const PlainVerticalStart: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        position: 'verticalStart',
    },
};

export const PlainHorizontalStart: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        position: 'horizontalStart',
    },
};

export const PlainHorizontalEnd: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        position: 'horizontalEnd',
    },
};
