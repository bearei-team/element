import {Meta, StoryObj} from '@storybook/react';
import {Checkbox, CheckboxProps} from './Checkbox';

export default {
    title: 'components/Checkbox',
    argTypes: {onPress: {action: 'pressed'}},
    component: Checkbox,
} as Meta<typeof Checkbox>;

export const CheckboxSelected: StoryObj<CheckboxProps> = {
    args: {active: true},
};

export const CheckboxIndeterminate: StoryObj<CheckboxProps> = {
    args: {indeterminate: true},
};

export const CheckboxError: StoryObj<CheckboxProps> = {
    args: {error: true},
};
