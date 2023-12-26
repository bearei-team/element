import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon} from '../Icon/Icon';
import {ButtonType, FabType} from './Button';
import {RenderProps} from './ButtonBase';

export interface UseIconOptions
    extends Required<
        Pick<
            RenderProps,
            | 'disabled'
            | 'type'
            | 'fabType'
            | 'category'
            | 'state'
            | 'indeterminate'
        >
    > {
    checked: boolean;
    icon?: React.JSX.Element;
    checkButton: boolean;
}

export const processCheckedIcon = (
    options: Pick<UseIconOptions, 'category' | 'checked' | 'indeterminate'>,
) => {
    const {category, checked, indeterminate} = options;
    const checkboxName = checked ? 'checkBox' : 'checkBoxOutlineBlank';
    const icon = {
        checkbox: (
            <Icon
                type="outlined"
                name={indeterminate ? 'indeterminateCheckBox' : checkboxName}
            />
        ),
        radio: (
            <Icon
                type="outlined"
                name={checked ? 'radioButtonChecked' : 'radioButtonUnchecked'}
            />
        ),
    };

    return icon[category as keyof typeof icon];
};

export const useIcon = (options: UseIconOptions) => {
    const {
        category,
        checked,
        disabled,
        fabType,
        icon,
        state,
        type,
        indeterminate,
        checkButton,
    } = options;
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

    const checkButtonFillType = {primary: theme.palette.primary.primary};
    const categoryIcon = {
        checkbox: checkButtonFillType,
        common: commonFillType,
        fab: fabFillType,
        icon: undefined,
        radio: checkButtonFillType,
    };

    const categoryType = category === 'fab' ? fabType : type;
    const iconType = (
        category === 'radio' ? 'primary' : categoryType
    ) as ButtonType & FabType;

    const checkedIcon =
        checkButton && processCheckedIcon({category, checked, indeterminate});

    const defaultIcon = checkButton ? checkedIcon : icon;
    const renderIcon =
        defaultIcon ?? (category === 'fab' ? <Icon /> : defaultIcon);

    if (category === 'common' || !renderIcon) {
        return icon;
    }

    return cloneElement(renderIcon, {
        state,
        fill: disabled
            ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
            : categoryIcon[category]?.[iconType],
    });
};
