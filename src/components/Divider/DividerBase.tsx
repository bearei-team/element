import {RefAttributes, forwardRef, useId} from 'react'
import {View, ViewProps} from 'react-native'
import {Layout, Size} from '../Common/interface'

export interface DividerProps extends Partial<ViewProps & RefAttributes<View>> {
    block?: boolean
    layout?: Layout
    renderStyle?: {width?: number; height?: number}
    size?: Size
    subheader?: string
}

export type RenderProps = DividerProps
export interface DividerBaseProps extends DividerProps {
    render: (props: RenderProps) => React.JSX.Element
}

export const DividerBase = forwardRef<View, DividerBaseProps>(
    ({layout, render, size, subheader, ...renderProps}, ref) => {
        const id = useId()

        return render({
            ...renderProps,
            id,
            layout,
            ref,
            size: subheader && layout === 'horizontal' ? 'small' : size,
            subheader
        })
    }
)
