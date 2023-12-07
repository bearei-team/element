import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './DividerBase';

export type ContainerProps = Pick<RenderProps, 'layout' | 'size'>;

export const Container = styled(View)<ContainerProps>`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}

    ${({layout = 'horizontal', theme}) => {
        const containerLayout = {
            horizontal: css`
                min-width: ${theme.adaptSize(320)}px;
            `,
            vertical: css`
                min-height: ${theme.adaptSize(120)}px;
                width: ${theme.adaptSize(1)}px;
            `,
        };

        return containerLayout[layout];
    }}
        ${({layout = 'horizontal', size = 'medium', theme}) => {
        const containerSize = {
            large: css``,
            medium:
                layout === 'horizontal'
                    ? css`
                          padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
                      `
                    : css`
                          padding-top: ${theme.adaptSize(theme.spacing.medium)}px;
                      `,
            small:
                layout === 'horizontal'
                    ? css`
                          padding: ${theme.adaptSize(0)}px
                              ${theme.adaptSize(theme.spacing.medium)}px;
                      `
                    : css`
                          padding-block-end: ${theme.adaptSize(theme.spacing.medium)}px
                              ${theme.adaptSize(0)}px;
                      `,
        };

        return containerSize[size];
    }};
`;

export const Content = styled.View`
    align-self: stretch;
    flex: 1;

    ${({theme}) => css`
        background-color: ${theme.palette.outline.outlineVariant};
        min-height: ${theme.adaptSize(1)}px;
    `}
`;

export const Subheader = styled.Text`
    align-self: stretch;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        font-size: ${theme.adaptFontSize(theme.typography.title.small.size)}px;
        font-style: ${theme.typography.title.small.style};
        font-weight: ${theme.typography.title.small.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.title.small.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.title.small.lineHeight)}px;
    `}
`;
