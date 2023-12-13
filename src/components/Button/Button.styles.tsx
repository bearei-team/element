import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ButtonBase';

export type ContentProps = Pick<
    RenderProps,
    'type' | 'iconShow' | 'category' | 'size' | 'labelTextShow'
>;

export type LabelTextProps = Omit<ContentProps, 'iconShow'>;
export type IconProps = Pick<ContentProps, 'category' | 'size'>;

export const Container = styled.View``;
export const Content = styled(Shape)<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({theme, type = 'filled'}) => {
        const containerType = {
            elevated: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            filled: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            outlined: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            text: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.medium - 4)}px;
            `,
            tonal: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
        };

        return containerType[type];
    }}

    ${({iconShow, theme, type = 'filled'}) => {
        const containerType = {
            elevated: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            filled: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            outlined: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            text: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium - 4)}px;
                padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            tonal: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
        };

        return iconShow && containerType[type];
    }}

    ${({theme, category = 'common'}) => {
        const categoryType = {
            common: css`
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
            `,
            icon: css`
                width: ${theme.adaptSize(theme.spacing.small * 5)}px;
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            fab: css`
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
        };

        return categoryType[category];
    }}

    ${({theme, category, size = 'medium'}) => {
        const containerSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                padding: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.small * 12)}px;
                padding: ${theme.adaptSize(theme.spacing.extraLarge - 2)}px;
            `,
        };

        return category === 'fab' && containerSize[size];
    }}
    
    ${({theme, category, labelTextShow}) =>
        category === 'fab' &&
        labelTextShow &&
        css`
            gap: ${theme.adaptSize(theme.spacing.small + theme.spacing.extraSmall)}px;
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            padding: ${theme.adaptSize(theme.spacing.medium)}px
                ${theme.adaptSize(theme.spacing.medium + theme.spacing.extraSmall)}px
                ${theme.adaptSize(theme.spacing.medium)}px
                ${theme.adaptSize(theme.spacing.medium)}px;
        `}
`;

export const LabelText = styled.Text<LabelTextProps>`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.label.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.large.lineHeight)}px;
    `}
`;

export const Icon = styled.View<IconProps>`
    overflow: hidden;

    ${({theme, category = 'common'}) => {
        const categoryType = {
            common: css`
                height: ${theme.adaptSize(theme.spacing.large - 6)}px;
                width: ${theme.adaptSize(theme.spacing.large - 6)}px;
            `,
            icon: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            fab: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
        };

        return categoryType[category];
    }}

    ${({theme, category, size = 'medium'}) => {
        const iconSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.small * 4)}px;
                width: ${theme.adaptSize(theme.spacing.small * 4)}px;
            `,
        };

        return category === 'fab' && iconSize[size];
    }}
`;
