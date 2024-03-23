import {ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './ButtonBase';

type UseBorderOptions = Pick<RenderProps, 'type'>;

export const useBorder = ({type = 'filled'}: UseBorderOptions) => {
    const theme = useTheme();
    const borderPosition =
        type === 'link'
            ? {borderBottomWidth: theme.adaptSize(1)}
            : {borderWidth: theme.adaptSize(1)};

    return [
        ['outlined', 'link'].includes(type) && {
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            ...borderPosition,
        },
    ];
};
