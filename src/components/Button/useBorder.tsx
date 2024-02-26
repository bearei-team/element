import {ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedInterpolation} from '../Common/interface';
import {RenderProps} from './ButtonBase';

interface UseBorderOptions extends Pick<RenderProps, 'type'> {
    borderColor?: AnimatedInterpolation;
}

export const useBorder = ({borderColor, type}: UseBorderOptions) => {
    const theme = useTheme();
    const borderPosition =
        type === 'link'
            ? {borderBottomWidth: theme.adaptSize(1)}
            : {borderWidth: theme.adaptSize(1)};

    return [
        borderColor && {
            borderColor,
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            ...borderPosition,
        },
    ];
};
