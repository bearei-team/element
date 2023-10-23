import {Shape} from '@bearei/theme';
import {FC, memo} from 'react';
import {ViewProps} from 'react-native';
import {Container, Shadow0, Shadow1} from './Elevation.styles';
import {BaseElevation, RenderProps} from './BaseElevation';

export interface ElevationProps extends ViewProps {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    shape?: keyof Shape;
}

export const Elevation: FC<ElevationProps> = memo((props): React.JSX.Element => {
    const render = ({
        id,
        children,
        level,
        shadowStyle,
        shape,
        ...args
    }: RenderProps): React.JSX.Element => {
        const {opacity0, opacity1, ...styles} = shadowStyle;

        return (
            <Container {...args} testID={`elevation--${id}`}>
                {children}
                {styles.width !== 0 && (
                    <Shadow0
                        testID={`elevation__shadow0--${id}`}
                        shape={shape}
                        level={level}
                        style={{...styles, opacity: opacity0}}
                    />
                )}

                {styles.width !== 0 && (
                    <Shadow1
                        testID={`elevation__shadow1--${id}`}
                        shape={shape}
                        level={level}
                        style={{...styles, opacity: opacity1}}
                    />
                )}
            </Container>
        );
    };

    return <BaseElevation {...props} render={render} />;
});
