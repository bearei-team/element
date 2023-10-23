import {Shape} from '@bearei/theme';
import {FC, memo} from 'react';
import {ViewProps} from 'react-native';
import {Container, Shadow0, Shadow1} from './Elevation.styles';
import {BaseElevation, RenderProps} from './BaseElevation';
import {Animated} from 'react-native';

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
        const {opacity0, opacity1, offset0, offset1, ...styles} = shadowStyle;

        return (
            <Animated.View {...args} testID={`elevation--${id}`}>
                {children}
                {styles.width !== 0 && (
                    <Shadow0
                        testID={`elevation__shadow0--${id}`}
                        shape={shape}
                        level={level}
                        style={{
                            ...styles,
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 4,
                                height: 4,
                            },
                        }}
                    />
                )}

                {/* {styles.width !== 0 && (
                    <Shadow1
                        testID={`elevation__shadow1--${id}`}
                        shape={shape}
                        level={level}
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            ...styles,
                            shadowOffset: {
                                width: 1,
                                height: 1,
                            },
                        }}
                    />
                )} */}
            </Animated.View>
        );
    };

    return <BaseElevation {...props} render={render} />;
});
