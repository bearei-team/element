import {ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedInterpolation} from '../Common/interface';

interface UseBorderOptions {
    borderColor?: AnimatedInterpolation;
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
