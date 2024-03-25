import {Meta, StoryObj} from '@storybook/react'
import {NavigationBar, NavigationBarProps} from './NavigationBar'

export default {
    title: 'components/NavigationBar',
    component: NavigationBar
} as Meta<typeof NavigationBar>

export const Bar: StoryObj<NavigationBarProps> = {
    args: {
        defaultActiveKey: 'A',
        data: [
            {
                labelText: 'Label1',
                key: 'A'
            },
            {
                labelText: 'Label2',
                key: 'B'
            },
            {
                labelText: 'Label3',
                key: 'C'
            }
        ]
    }
}

export const BlockBar: StoryObj<NavigationBarProps> = {
    args: {
        defaultActiveKey: 'name',
        block: true,
        data: [
            {
                labelText: 'Label1',
                key: 'name'
            },
            {
                labelText: 'Label2',
                key: 'age'
            },
            {
                labelText: 'Label3',
                key: 'sex'
            }
        ]
    }
}

export const TypeBlockBar: StoryObj<NavigationBarProps> = {
    args: {
        defaultActiveKey: 'name',
        type: 'block',
        shape: 'full',
        data: [
            {
                labelText: 'Label1',
                key: 'name'
            },
            {
                labelText: 'Label2',
                key: 'age'
            },
            {
                labelText: 'Label3',
                key: 'sex'
            }
        ]
    }
}
