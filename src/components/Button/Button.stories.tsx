import {StoryObj, Meta} from '@storybook/react';
import {ButtonProps, Button} from './Button';

export default {
    title: 'components/Button',
    argTypes: {onPress: {action: 'pressed'}},
    component: Button,
} as Meta<typeof Button>;

export const Filled: StoryObj<ButtonProps> = {
    args: {
        label: 'Label',
    },
};
