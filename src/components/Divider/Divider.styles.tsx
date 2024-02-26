import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Typography} from '../Common/Common.styles';
import {RenderProps} from './DividerBase';

type ContainerProps = Pick<RenderProps, 'layout' | 'size' | 'renderStyle'>;

export const Container = styled(View)<ContainerProps>`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}

    ${({layout = 'horizontal', theme, renderStyle = {}}) => {
        const {width, height} = renderStyle;
        const containerLayout = {
            horizontal: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 40)}px;
                width: ${typeof width === 'number' ? `${theme.adaptSize(width)}px}` : 'auto'};
            `,
            vertical: css`
                height: ${typeof height === 'number' ? `${theme.adaptSize(height)}px}` : 'auto'};
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
                          padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
                      `
                    : css`
                          padding-top: ${theme.adaptSize(theme.spacing.medium)}px;
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
