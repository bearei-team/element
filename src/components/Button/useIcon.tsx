import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon} from '../Icon/Icon';
import {ButtonType, FabType} from './Button';
import {RenderProps} from './ButtonBase';

export interface UseIconOptions
    extends Required<
        Pick<
            RenderProps,
            'disabled' | 'type' | 'fabType' | 'category' | 'state'
        >
    > {
    checked: boolean;
    icon?: React.JSX.Element;
}

export const useIcon = (options: UseIconOptions) => {
    const {disabled, icon, type, fabType, category, state, checked} = options;
    const theme = useTheme();
    const commonFillType = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.surface.onSurfaceVariant,
        tonal: theme.palette.surface.onSurfaceVariant,
    };

    const fabFillType = {
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        surface: theme.palette.primary.primary,
        tertiary: theme.palette.tertiary.onTertiaryContainer,
    };

    const radioType = {primary: theme.palette.primary.primary};
    const categoryIcon = {
        common: commonFillType,
        fab: fabFillType,
        radio: radioType,
        icon: undefined,
    };

    const categoryType = category === 'fab' ? fabType : type;
    const iconType = (
        category === 'radio' ? 'primary' : categoryType
    ) as ButtonType & FabType;

    const fill = categoryIcon[category]?.[iconType];
    const checkedIcon = (
        <Icon
            type="outlined"
            name={checked ? 'radioButtonChecked' : 'radioButtonUnchecked'}
        />
    );

    const radioIcon = category === 'radio' ? checkedIcon : icon;
    const defaultIcon = icon ?? (category === 'fab' ? <Icon /> : radioIcon);

    if (category === 'common' || !defaultIcon) {
        return icon;
    }

    return cloneElement(defaultIcon, {
        state,
        fill: disabled
            ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
            : fill,
    });
};
