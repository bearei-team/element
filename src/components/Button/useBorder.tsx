import {Animated, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {ButtonType} from './Button';

export interface UseBorderOptions {
    borderColor?: Animated.AnimatedInterpolation<string | number>;
    type: ButtonType;
}

export const useBorder = (options: UseBorderOptions) => {
    const theme = useTheme();
    const {borderColor, type} = options;
    const borderPosition =
        type === 'link'
            ? {borderBottomWidth: theme.adaptSize(1)}
            : {borderWidth: theme.adaptSize(1)};

    return (
        borderColor && {
            borderColor,
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            ...borderPosition,
        }
    );
};
