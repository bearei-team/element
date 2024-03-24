import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import {Container, LabelText} from './Badge.styles'
import {BadgeBase, BadgeProps, RenderProps} from './BadgeBase'

const render = ({id, labelText, size, ...containerProps}: RenderProps) => (
    <Container
        {...containerProps}
        shape='full'
        size={size}
        testID={`badge--${id}`}
    >
        {size !== 'small' && (
            <LabelText
                size='small'
                testID={`badge__labelText--${id}`}
                type='label'
            >
                {labelText}
            </LabelText>
        )}
    </Container>
)

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => (
    <BadgeBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge)
export type {BadgeProps}
