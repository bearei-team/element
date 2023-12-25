import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ButtonBase';

export type ContainerProps = Pick<
    RenderProps,
    'block' | 'type' | 'size' | 'category'
>;
export interface ContentProps
    extends Pick<
        RenderProps,
        'type' | 'iconShow' | 'category' | 'size' | 'labelTextShow' | 'block'
    > {
    width: number;
}

export type LabelTextProps = Omit<ContentProps, 'iconShow' | 'width' | 'block'>;
export type IconProps = Pick<ContentProps, 'category' | 'size'>;

export const Container = styled.View<ContainerProps>`
    display: inline;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 5)}px;
        `}

    ${({theme, type = 'filled', category = 'common'}) => {
        const containerType = {
            elevated: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
            `,
            filled: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
            `,
            outlined: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
            `,
            text: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 7 + 3)}px;
            `,
            tonal: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
            `,
        };

        return category === 'common'
            ? containerType[type]
            : category === 'icon' &&
                  css`
                      width: ${theme.adaptSize(theme.spacing.small * 5)}px;
                  `;
    }}

    ${({theme, category, size = 'medium'}) => {
        const containerSize = {
            small: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 5)}px;
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
            `,
            medium: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
                height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
            large: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 12)}px;
                height: ${theme.adaptSize(theme.spacing.small * 12)}px;
            `,
        };

        return category === 'fab' && containerSize[size];
    }}

    ${({block}) =>
        block &&
        css`
            display: inline-block;
            flex: 1;
            width: 100%;
        `}
`;

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
        const contentType = {
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
                    ${theme.adaptSize(
                        theme.spacing.medium - theme.spacing.extraSmall,
                    )}px;
            `,
            tonal: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
        };

        return contentType[type];
    }}

    ${({iconShow, theme, type = 'filled'}) => {
        const contentType = {
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

        return iconShow && contentType[type];
    }}

    ${({theme, category = 'common'}) => {
        const contentCategory = {
            common: css``,
            icon: css`
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            radio: css`
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            fab: css`
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
        };

        return contentCategory[category];
    }}

    ${({theme, category, size = 'medium'}) => {
        const contentSize = {
            small: css`
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            medium: css`
                padding: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            large: css`
                padding: ${theme.adaptSize(theme.spacing.extraLarge - 2)}px;
            `,
        };

        return category === 'fab' && contentSize[size];
    }}
    
    ${({theme, category, labelTextShow}) =>
        category === 'fab' &&
        labelTextShow &&
        css`
            gap: ${theme.adaptSize(
                theme.spacing.small + theme.spacing.extraSmall,
            )}px;
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            padding: ${theme.adaptSize(theme.spacing.medium)}px
                ${theme.adaptSize(
                    theme.spacing.medium + theme.spacing.extraSmall,
                )}px
                ${theme.adaptSize(theme.spacing.medium)}px
                ${theme.adaptSize(theme.spacing.medium)}px;
        `}
        
    ${({block, width}) =>
        block &&
        css`
            width: ${width}px;
        `}
`;

export const LabelText = styled.Text<LabelTextProps>`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(
            theme.typography.label.large.letterSpacing,
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography.label.large.lineHeight,
        )}px;
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
            radio: css`
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
                height: ${theme.adaptSize(theme.spacing.extraLarge)}px;
                width: ${theme.adaptSize(theme.spacing.extraLarge)}px;
            `,
        };

        return category === 'fab' && iconSize[size];
    }}
`;
