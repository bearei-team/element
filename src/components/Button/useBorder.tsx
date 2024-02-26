import {ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedInterpolation} from '../Common/interface';
import {ButtonType} from './Button';

export interface UseBorderOptions {
    borderColor?: AnimatedInterpolation;
    type: ButtonType;
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
