import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import {Container, LabelText} from './Avatar.styles'
import {AvatarBase, AvatarProps, RenderProps} from './AvatarBase'

const render = ({id, labelText, ...containerProps}: RenderProps) => (
    <Container
        {...containerProps}
        shape='full'
        testID={`avatar--${id}`}
    >
        <LabelText
            ellipsizeMode='tail'
            numberOfLines={1}
            size='medium'
            testID={`avatar__labelText--${id}`}
            type='title'
        >
            {labelText}
        </LabelText>
    </Container>
)

const ForwardRefAvatar = forwardRef<View, AvatarProps>((props, ref) => (
    <AvatarBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Avatar: FC<AvatarProps> = memo(ForwardRefAvatar)
export type {AvatarProps}
