import {Animated, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './ButtonBase';

export interface UseBorderOptions extends Required<Pick<RenderProps, 'type'>> {
    borderColor?: Animated.AnimatedInterpolation<string | number>;
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
