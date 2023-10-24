import {Animated, ViewProps} from 'react-native';
import {FC, memo} from 'react';
import {BaseElevation, RenderProps} from './BaseElevation';
import {Container, Main} from './Elevation.styles';
import {ShapeProps} from '../Common/Shape.styles';
export interface ElevationProps extends ViewProps {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    shapeProps?: ShapeProps;
}

export const Elevation: FC<ElevationProps> = memo(props => {
    const render = ({id, level, shadowStyle, shapeProps, children}: RenderProps) => {
        const AnimatedContainer = Animated.createAnimatedComponent(Container);
        const AnimatedMain = Animated.createAnimatedComponent(Main);

        return (
            <AnimatedContainer
                {...shapeProps}
                testID={`elevation--${id}`}
                level={level}
                style={{shadowOpacity: shadowStyle.shadowOpacity0}}>
                <AnimatedMain
                    {...shapeProps}
                    testID={`elevation__main--${id}`}
                    level={level}
                    style={{shadowOpacity: shadowStyle.shadowOpacity1}}>
                    {children}
                </AnimatedMain>
            </AnimatedContainer>
        );
    };

    return <BaseElevation {...props} render={render} />;
});
