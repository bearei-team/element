import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Typography} from '../Common/Common.styles';
import {RenderProps} from './DividerBase';

export type ContainerProps = Pick<
    RenderProps,
    'layout' | 'size' | 'width' | 'height'
>;

export const Container = styled(View)<ContainerProps>`
    align-items: flex-start;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}

    ${({layout = 'horizontal', theme, width = 0, height = 0}) => {
        const containerLayout = {
            horizontal: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 40)}px;
                width: ${width}px;
            `,
            vertical: css`
                height: ${height}px;
                min-height: ${theme.adaptSize(theme.spacing.small * 15)}px;
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
                          padding-left: ${theme.adaptSize(
                              theme.spacing.medium,
                          )}px;
                      `
                    : css`
                          padding-top: ${theme.adaptSize(
                              theme.spacing.medium,
                          )}px;
                      `,
            small:
                layout === 'horizontal'
                    ? css`
                          padding: ${theme.adaptSize(theme.spacing.none)}px
                              ${theme.adaptSize(theme.spacing.medium)}px;
                      `
                    : css`
                          padding: ${theme.adaptSize(theme.spacing.medium)}px
                              ${theme.adaptSize(theme.spacing.none)}px;
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

export const Subheader = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
    `}
`;
