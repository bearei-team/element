import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon} from '../Icon/Icon';
import {RenderProps} from './CheckboxBase';

export interface UseIconOptions
    extends Pick<RenderProps, 'disabled' | 'eventName' | 'type' | 'error'> {
    icon?: React.JSX.Element;
}

export const useIcon = (options: UseIconOptions) => {
    const {disabled, error, eventName, type = 'unselected'} = options;
    const theme = useTheme();
    const checkColor =
        type === 'unselected'
            ? theme.palette.surface.onSurfaceVariant
            : theme.palette.primary.primary;

    const color = error ? theme.palette.error.error : checkColor;
    const icon = {
        indeterminate: <Icon type="filled" name="indeterminateCheckBox" />,
        selected: <Icon type="filled" name="checkBox" />,
        unselected: <Icon type="filled" name="checkBoxOutlineBlank" />,
    };

    return [
        cloneElement(icon[type], {
            eventName,
            fill: disabled ? theme.color.rgba(theme.palette.surface.onSurface, 0.38) : color,
        }),
    ];
};
