import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import {Container, Content, Subheader} from './Divider.styles'
import {DividerBase, DividerProps, RenderProps} from './DividerBase'

const render = ({
    id,
    subheader,
    renderStyle,
    style,
    ...containerProps
}: RenderProps) => (
    <Container
        {...containerProps}
        testID={`divider--${id}`}
        renderStyle={renderStyle}
    >
        <Content
            style={style}
            testID={`divider__content--${id}`}
        />

        {subheader && (
            <Subheader
                size='small'
                testID={`divider__subheader--${id}`}
                type='title'
            >
                {subheader}
            </Subheader>
        )}
    </Container>
)

const ForwardRefDivider = forwardRef<View, DividerProps>((props, ref) => (
    <DividerBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Divider: FC<DividerProps> = memo(ForwardRefDivider)
export type {DividerProps}
