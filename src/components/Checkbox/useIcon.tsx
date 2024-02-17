import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon} from '../Icon/Icon';
import {RenderProps} from './CheckboxBase';

export interface UseIconOptions
    extends Pick<RenderProps, 'disabled' | 'eventName' | 'type' | 'error'> {
    icon?: React.JSX.Element;
}

export const useIcon = ({disabled, error, eventName, type = 'unselected'}: UseIconOptions) => {
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
            width: theme.adaptSize(theme.spacing.large),
            height: theme.adaptSize(theme.spacing.large),
            fill: disabled
                ? theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38)
                : color,
        }),
    ];
};
