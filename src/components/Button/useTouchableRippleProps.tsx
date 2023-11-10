import {useTheme} from 'styled-components/native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Type} from './Button';

export interface UseTouchableRipplePropsOptions extends TouchableRippleProps {
    type: Type;
}

export const useTouchableRippleProps = ({type, ...props}: UseTouchableRipplePropsOptions) => {
    const {palette} = useTheme();
    const underlay = {
        elevated: palette.primary.primary,
        filled: palette.primary.onPrimary,
        outlined: palette.primary.primary,
        text: palette.primary.primary,
        tonal: palette.secondary.onSecondaryContainer,
    };

    return {
        ...props,
        underlayColor: underlay[type],
    };
};
