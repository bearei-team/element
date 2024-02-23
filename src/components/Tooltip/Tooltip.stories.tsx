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
        supportingPosition: 'verticalEnd',
    },
};

export const PlainVerticalStart: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        supportingPosition: 'verticalStart',
    },
};

export const PlainHorizontalStart: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        supportingPosition: 'horizontalStart',
    },
};

export const PlainHorizontalEnd: StoryObj<TooltipProps> = {
    args: {
        children: <Icon name="addHome" />,
        supportingText: 'Supporting Text',
        visible: true,
        supportingPosition: 'horizontalEnd',
    },
};
