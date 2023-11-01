import {Animated, View, ViewProps} from 'react-native';
import {BaseHovered, RenderProps} from './BaseHovered';
import {Container} from './Hovered.styles';
import {FC, memo} from 'react';
import {State} from '../common/interface';
import {ShapeProps} from '../Common/Shape.styles';

export interface HoveredProps
    extends Animated.AnimatedProps<ViewProps & React.RefAttributes<View>> {
    width?: number;
    height?: number;
    underlayColor?: string;
    opacity?: number;
    state?: State;
    disabled?: boolean;
    shapeProps?: ShapeProps;
}

export const Hovered: FC<HoveredProps> = memo(props => {
    const render = ({id, shapeProps, ...containerProps}: RenderProps) => {
        const AnimatedContainer = Animated.createAnimatedComponent(Container);

        return (
            <>
                {containerProps.width !== 0 && (
                    <AnimatedContainer
                        {...{...shapeProps, ...containerProps}}
                        testID={`hovered--${id}`}
                    />
                )}
            </>
        );
    };

    return <BaseHovered {...props} render={render} />;
});
