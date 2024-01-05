import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './ButtonBase';

export interface ContainerProps extends Pick<RenderProps, 'block'> {}

export interface ContentProps extends Pick<RenderProps, 'type' | 'block'> {
    iconShow: boolean;
    width?: number;
}

export const Container = styled(View)<ContainerProps>`
    ${({block}) =>
        block &&
        css`
            align-self: stretch;
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
    position: relative;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}

    ${({theme, type = 'filled'}) => {
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
                min-width: ${theme.adaptSize(theme.spacing.small * 7 + 3)}px;
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
            link: css``,
            tonal: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
        };

        return iconShow && contentType[type];
    }}

    ${({block, width = 0}) =>
        block &&
        css`
            width: ${width}px;
        `}
`;

export const LabelText = styled(Typography)`
    user-select: none;
    text-align: center;
`;

export const Icon = styled.View`
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large - 6)}px;
        width: ${theme.adaptSize(theme.spacing.large - 6)}px;
    `}
`;
