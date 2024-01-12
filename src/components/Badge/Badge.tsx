import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../Common/interface';
import {Container, LabelText} from './Badge.styles';
import {BadgeBase, RenderProps} from './BadgeBase';

export interface BadgeProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: number | string;
    size?: Size;
}

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, labelText, size, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} shape="full" size={size} testID={`badge--${id}`}>
                {size !== 'small' && (
                    <LabelText size="small" testID={`badge__labelText--${id}`} type="label">
                        {labelText}
                    </LabelText>
                )}
            </Container>
        );
    };

    return <BadgeBase {...props} ref={ref} render={render} />;
});

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge);
