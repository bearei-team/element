import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ButtonBase';

export interface ContainerProps
    extends Pick<RenderProps, 'block' | 'type' | 'size' | 'category'> {
    width: number;
    height: number;
}

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
    ${({block, width = 0, height = 0}) =>
        block
            ? css`
                  width: 100%;
              `
            : css`
                  width: ${width}px;
                  height: ${height}px;
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
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}

    ${({theme, category, type = 'filled'}) => {
        const contentType = {
            elevated: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            filled: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            outlined: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            text: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 6)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(
                        theme.spacing.medium - theme.spacing.extraSmall,
                    )}px;
            `,
            link: css`
                height: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            tonal: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
        };

        return category === 'common' && contentType[type];
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
            link: css``,
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
                height: ${theme.adaptSize(theme.spacing.small * 6)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 6)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
                width: ${theme.adaptSize(theme.spacing.small * 6)}px;
            `,
            radio: css`
                height: ${theme.adaptSize(theme.spacing.small * 6)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 6)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
                width: ${theme.adaptSize(theme.spacing.small * 6)}px;
            `,
            checkbox: css`
                height: ${theme.adaptSize(theme.spacing.small * 6)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 6)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
                width: ${theme.adaptSize(theme.spacing.small * 6)}px;
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
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 5)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                padding: ${theme.adaptSize(theme.spacing.medium)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.small * 12)}px;
                padding: ${theme.adaptSize(theme.spacing.extraLarge - 2)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 12)}px;
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
        
    ${({block, width = 0, type}) =>
        block &&
        type !== 'link' &&
        css`
            width: ${width}px;
        `}
`;

export const LabelText = styled.Text<LabelTextProps>`
    user-select: none;
    text-align: center;

    ${({theme, type}) =>
        type === 'link'
            ? css`
                  font-size: ${theme.adaptFontSize(
                      theme.typography.body.small.size,
                  )}px;
                  font-style: ${theme.typography.body.small.style};
                  font-weight: ${theme.typography.body.small.weight};
                  height: ${theme.adaptSize(
                      theme.typography.body.small.lineHeight,
                  )}px;

                  letter-spacing: ${theme.adaptSize(
                      theme.typography.body.small.letterSpacing,
                  )}px;

                  line-height: ${theme.adaptSize(
                      theme.typography.body.small.lineHeight,
                  )}px;
              `
            : css`
                  font-size: ${theme.adaptFontSize(
                      theme.typography.label.large.size,
                  )}px;

                  font-style: ${theme.typography.label.large.style};
                  font-weight: ${theme.typography.label.large.weight};
                  height: ${theme.adaptSize(
                      theme.typography.label.large.lineHeight,
                  )}px;

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
            checkbox: css`
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
