import {Meta, StoryObj} from '@storybook/react'
import {Chip, ChipProps} from './Chip'

export default {
    title: 'components/Chip',
    argTypes: {onPress: {action: 'pressed'}},
    component: Chip
} as Meta<typeof Chip>

export const Filter: StoryObj<ChipProps> = {
    args: {
        labelText: 'Label',
        defaultActive: true
    }
}

export const Assist: StoryObj<ChipProps> = {
    args: {
        labelText: 'Label',
        type: 'assist'
    }
}

export const Input: StoryObj<ChipProps> = {
    args: {
        labelText: 'Label',
        type: 'input'
    }
}

export const Suggestion: StoryObj<ChipProps> = {
    args: {
        labelText: 'Label',
        type: 'suggestion',
        elevated: true
    }
}

export const Elevated: StoryObj<ChipProps> = {
    args: {
        labelText: 'Label',
        type: 'suggestion',
        elevated: true
    }
}
