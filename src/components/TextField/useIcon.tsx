import {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './TextFieldBase';

export interface UseIconOptions
    extends Pick<RenderProps, 'disabled' | 'leadingIcon' | 'trailingIcon' | 'error'> {}

export const useIcon = ({disabled, leadingIcon, trailingIcon, error}: UseIconOptions) => {
    const theme = useTheme();
    const fillColor = theme.palette.surface.onSurfaceVariant;
    const errorColor = theme.palette.error.error;
    const defaultColor = error ? errorColor : fillColor;
    const disabledColor = theme.color.rgba(theme.palette.surface.onSurface, 0.38);

    return [
        {
            leadingIcon:
                leadingIcon &&
                cloneElement(leadingIcon, {
                    fill: disabled ? disabledColor : fillColor,
                }),
            trailingIcon:
                trailingIcon &&
                cloneElement(trailingIcon, {
                    fill: disabled ? disabledColor : defaultColor,
                }),
        },
    ];
};
