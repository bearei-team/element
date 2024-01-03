import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container, LabelText} from './Avatar.styles';
import {AvatarBase, RenderProps} from './AvatarBase';

export interface AvatarProps extends Partial<ViewProps & RefAttributes<View>> {
    height?: number;
    labelText?: string;
    width?: number;
}

/**
 * TODO: Image support
 */
const ForwardRefAvatar = forwardRef<View, AvatarProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, labelText, ...containerProps} = renderProps;

        return (
            <Container
                {...containerProps}
                ref={ref}
                shape="full"
                testID={`avatar--${id}`}>
                <LabelText
                    testID={`avatar__labelText--${id}`}
                    numberOfLines={1}>
                    {labelText}
                </LabelText>
            </Container>
        );
    };

    return <AvatarBase {...props} render={render} />;
});

export const Avatar: FC<AvatarProps> = memo(ForwardRefAvatar);
