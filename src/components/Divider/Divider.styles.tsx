import styled, {css} from 'styled-components/native';
import {DividerProps} from './Divider';
import {View} from 'react-native';

export type ContainerProps = Pick<DividerProps, 'layout' | 'size'>;

export const Container = styled(View)<ContainerProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    ${({theme}) => css`
        gap: ${theme.spacing.extraSmall}px;
    `}

    ${({layout = 'horizontal'}) => {
        const themeType = {
            horizontal: css`
                min-width: 320px;
            `,
            vertical: css`
                width: 1px;
                min-height: 120px;
            `,
        };

        return themeType[layout];
    }}
        ${({theme, size = 'medium', layout = 'horizontal'}) => {
        const themeType = {
            large: css``,

            medium:
                layout === 'horizontal'
                    ? css`
                          padding-start: ${theme.spacing.medium}px;
                      `
                    : css`
                          padding-top: ${theme.spacing.medium}px;
                      `,

            small:
                layout === 'horizontal'
                    ? css`
                          padding-horizontal: ${theme.spacing.medium}px;
                      `
                    : css`
                          padding-vertical: ${theme.spacing.medium}px;
                      `,
        };

        return themeType[size];
    }};
`;

export const Main = styled.View`
    flex: 1;
    align-self: stretch;
    min-height: 1px;

    ${({theme}) => css`
        background-color: ${theme.palette.outline.outlineVariant};
    `}
`;

export const Subheader = styled.Text`
    align-self: stretch;

    ${({theme}) => css`
        font-size: ${theme.typography.title.small.size}px;
        font-style: ${theme.typography.title.small.style};
        font-weight: ${theme.typography.title.small.weight};
        line-height: ${theme.typography.title.small.lineHeight}px;
        letter-spacing: ${theme.typography.title.small.letterSpacing}px;
        color: ${theme.palette.surface.onSurfaceVariant};
    `}
`;
