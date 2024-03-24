import {Meta, StoryObj} from '@storybook/react'
import {Icon, IconProps} from './Icon'

export default {
    title: 'components/Icon',
    component: Icon
} as Meta<typeof Icon>

export const Filled: StoryObj<IconProps> = {
    args: {
        type: 'filled',
        name: 'checkBox'
    }
}

export const Outlined: StoryObj<IconProps> = {
    args: {
        type: 'outlined',
        name: 'lens'
    }
}
