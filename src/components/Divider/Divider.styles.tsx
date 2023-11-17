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
        gap: ${theme.spacing.extraSmall}px;
    `}

    ${({layout = 'horizontal'}) => {
        const containerLayout = {
            horizontal: css`
                min-width: 320px;
            `,
            vertical: css`
                min-height: 120px;
                width: 1px;
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

        return containerSize[size];
    }};
`;

const Main = styled.View`
    align-self: stretch;
    flex: 1;
    min-height: 1px;

    ${({theme}) => css`
        background-color: ${theme.palette.outline.outlineVariant};
    `}
`;

const Subheader = styled.Text`
    align-self: stretch;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        font-size: ${theme.typography.title.small.size}px;
        font-style: ${theme.typography.title.small.style};
        font-weight: ${theme.typography.title.small.weight};
        letter-spacing: ${theme.typography.title.small.letterSpacing}px;
        line-height: ${theme.typography.title.small.lineHeight}px;
    `}
`;

export {Container, Main, Subheader};
