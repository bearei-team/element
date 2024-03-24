import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import {Container} from './FormItem.styles'
import {
    ControlProps,
    FormItemBase,
    FormItemProps,
    RenderProps
} from './FormItemBase'

const render = ({id, children, ...containerProps}: RenderProps) => (
    <Container
        {...containerProps}
        testID={`formItem--${id}`}
    >
        {children}
    </Container>
)

const ForwardRefFormItem = forwardRef<View, FormItemProps>((props, ref) => (
    <FormItemBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const FormItem: FC<FormItemProps> = memo(ForwardRefFormItem)
export type {ControlProps, FormItemProps}
