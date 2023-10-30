import {ViewProps} from 'react-native';
import {FC, memo} from 'react';
import {BaseElevation, RenderProps} from './BaseElevation';
import {Container, Main} from './Elevation.styles';
import {ShapeProps} from '../Common/Shape.styles';
export interface ElevationProps extends ViewProps {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    shapeProps?: ShapeProps;
}

export const Elevation: FC<ElevationProps> = memo(props => {
    const render = ({id, level, shapeProps, children}: RenderProps) => {
        return (
            <Container {...shapeProps} testID={`elevation--${id}`} level={level} shadow={0}>
                <Main {...shapeProps} testID={`elevation__main--${id}`} level={level} shadow={1}>
                    {children}
                </Main>
            </Container>
        );
    };

    return <BaseElevation {...props} render={render} />;
});
