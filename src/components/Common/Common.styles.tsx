import {Typography as EITypography, Shape as ThemeShape} from '@bearei/theme';
import {View, ViewStyle} from 'react-native';
import styled, {css} from 'styled-components/native';
import {AnimatedInterpolation, Size} from './interface';

export interface ShapeProps {
    border?: {
        color?: string | AnimatedInterpolation;
        style?: ViewStyle['borderStyle'];
        width?: number | AnimatedInterpolation;
    };
    shape?: keyof ThemeShape;
}

export interface TypographyProps {
    size?: Size;
    type?: keyof EITypography;
}

export const Shape = styled(View)<ShapeProps>`
    ${({shape = 'none', theme}) => css`
        border-bottom-left-radius: ${theme.adaptSize(
            theme.shape[shape].bottomLeft,
        )}px;

        border-bottom-right-radius: ${theme.adaptSize(
            theme.shape[shape].bottomLeft,
        )}px;

        border-top-left-radius: ${theme.adaptSize(
            theme.shape[shape].topLeft,
        )}px;

        border-top-right-radius: ${theme.adaptSize(
            theme.shape[shape].topRight,
        )}px;
    `}

    ${({border = {}, theme}) => {
        const {
            color = theme.palette.primary,
            style = 'solid',
            width = theme.adaptSize(1),
        } = border;

        const animatedInterpolation =
            typeof color !== 'string' || typeof width !== 'number';

        return (
            border &&
            !animatedInterpolation &&
            css`
                border-color: ${color};
                border-style: ${style};
                border-width: ${width}px;
            `
        );
    }}
`;

export const Typography = styled.Text<TypographyProps>`
    ${({theme, type = 'title', size = 'medium'}) => {
        const typography = {
            title: {
                medium: css`
                    color: ${theme.palette.primary.onPrimaryContainer};
                    font-size: ${theme.adaptFontSize(
                        theme.typography.title.medium.size,
                    )}px;

                    font-style: ${theme.typography.title.medium.style};
                    font-weight: ${theme.typography.title.medium.weight};
                    height: ${theme.adaptSize(
                        theme.typography.title.medium.lineHeight,
                    )}px;

                    letter-spacing: ${theme.adaptSize(
                        theme.typography.title.medium.letterSpacing,
                    )}px;

                    line-height: ${theme.adaptSize(
                        theme.typography.title.medium.lineHeight,
                    )}px;

                    max-width: ${theme.adaptSize(
                        theme.spacing.small + theme.spacing.extraSmall,
                    )}px;
                `,
                large: css``,
                small: css`
                    font-size: ${theme.adaptFontSize(
                        theme.typography.title.small.size,
                    )}px;

                    font-style: ${theme.typography.title.small.style};
                    font-weight: ${theme.typography.title.small.weight};
                    height: ${theme.adaptSize(
                        theme.typography.title.small.lineHeight,
                    )}px;

                    letter-spacing: ${theme.adaptSize(
                        theme.typography.title.small.letterSpacing,
                    )}px;

                    line-height: ${theme.adaptSize(
                        theme.typography.title.small.lineHeight,
                    )}px;
                `,
            },
            label: {
                medium: css``,
                large: css``,
                small: css`
                    font-size: ${theme.adaptFontSize(
                        theme.typography.label.small.size,
                    )}px;

                    font-style: ${theme.typography.label.small.style};
                    font-weight: ${theme.typography.label.small.weight};
                    height: ${theme.adaptSize(
                        theme.typography.label.small.lineHeight,
                    )}px;

                    letter-spacing: ${theme.adaptSize(
                        theme.typography.label.small.letterSpacing,
                    )}px;

                    line-height: ${theme.adaptSize(
                        theme.typography.label.small.lineHeight,
                    )}px;
                `,
            },
            display: {
                medium: css``,
                large: css``,
                small: css``,
            },
            headline: {
                medium: css``,
                large: css``,
                small: css``,
            },
            body: {
                medium: css``,
                large: css``,
                small: css``,
            },
        };

        return typography[type][size];
    }}
`;
