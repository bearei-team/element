import {Shape as ThemeShape} from '@bearei/theme';
import {FC, memo} from 'react';
import {ViewProps} from 'react-native';
import {BaseShape, RenderProps} from './BaseShape';
import {Container} from './Shape.styles';

export interface ShapeProps extends ViewProps {
    shape?: keyof ThemeShape;
}

export const Shape: FC<ShapeProps> = memo((props): React.JSX.Element => {
    const render = ({id, children, ...args}: RenderProps): React.JSX.Element => (
        <Container {...args} testID={`shape--${id}`}>
            {children}
        </Container>
    );

    return <BaseShape {...props} render={render} />;
});
