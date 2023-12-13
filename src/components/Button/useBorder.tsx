import {Animated, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';

export interface UseBorderOptions {
    borderColor?: Animated.AnimatedInterpolation<string | number>;
}

export const useBorder = (options: UseBorderOptions) => {
    const theme = useTheme();
    const {borderColor} = options;

    return (
        borderColor && {
            borderColor,
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            borderWidth: theme.adaptSize(1),
        }
    );
};
