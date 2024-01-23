import {Animated, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';

export interface UseBorderOptions {
    borderColor?: Animated.AnimatedInterpolation<string | number>;
}

export const useBorder = ({borderColor}: UseBorderOptions) => {
    const theme = useTheme();
    const borderPosition = {borderWidth: theme.adaptSize(1)};

    return [
        borderColor && {
            borderColor,
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            ...borderPosition,
        },
    ];
};
