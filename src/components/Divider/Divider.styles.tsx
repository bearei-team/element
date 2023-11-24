import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {DividerProps} from './Divider';

export type ContainerProps = Pick<DividerProps, 'layout' | 'size'>;

const Container = styled(View)<ContainerProps>`
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
                          padding-start: ${theme.adaptSize(theme.spacing.medium)}px;
                      `
                    : css`
                          padding-top: ${theme.adaptSize(theme.spacing.medium)}px;
                      `,
            small:
                layout === 'horizontal'
                    ? css`
                          padding-horizontal: ${theme.adaptSize(theme.spacing.medium)}px;
                      `
                    : css`
                          padding-vertical: ${theme.adaptSize(theme.spacing.medium)}px;
                      `,
        };

        return containerSize[size];
    }};
`;

const Main = styled.View`
    align-self: stretch;
    flex: 1;

    ${({theme}) => css`
        min-height: ${theme.adaptSize(1)}px;
        background-color: ${theme.palette.outline.outlineVariant};
    `}
`;

const Subheader = styled.Text`
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

export {Container, Main, Subheader};
