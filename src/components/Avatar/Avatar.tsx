import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container, LabelText} from './Avatar.styles';
import {AvatarBase, RenderProps} from './AvatarBase';

export interface AvatarProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: string;
    renderStyle?: {height?: number; width?: number};
}

const render = ({id, labelText, ...containerProps}: RenderProps) => (
    <Container {...containerProps} shape="full" testID={`avatar--${id}`}>
        <LabelText
            ellipsizeMode="tail"
            numberOfLines={1}
            size="medium"
            testID={`avatar__labelText--${id}`}
            type="title">
            {labelText}
        </LabelText>
    </Container>
);

const ForwardRefAvatar = forwardRef<View, AvatarProps>((props, ref) => (
    <AvatarBase {...props} ref={ref} render={render} />
));

export const Avatar: FC<AvatarProps> = memo(ForwardRefAvatar);
