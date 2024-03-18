import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../../Common/Common.styles';
import {RenderProps} from './SheetBase';

type ContainerProps = Pick<RenderProps, 'position' | 'type' | 'visible'>;
type HeaderProps = Pick<RenderProps, 'back'>;

export const Container = styled(View)<ContainerProps>`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    flex: 1;

    ${({type, theme}) =>
        type === 'standard' &&
        css`
            width: ${theme.adaptSize(theme.spacing.small * 40)}px;
        `}

    ${({position = 'horizontalEnd', type}) => {
        const innerPosition = {
            horizontalStart: css`
                justify-content: flex-start;
            `,
            horizontalEnd: css`
                justify-content: flex-end;
            `,
        };

        return type === 'modal' && innerPosition[position];
    }}

    ${({visible = false, theme, type}) =>
        !visible &&
        type === 'standard' &&
        css`
            height: ${theme.adaptSize(theme.spacing.none)}px;
            pointer-events: none;
        `}
`;

export const Inner = styled(Shape)`
    ${({theme}) => css`
        background-color: ${theme.palette.surface.surfaceContainerLow};
        width: ${theme.adaptSize(theme.spacing.small * 40)}px;
        min-height: ${theme.adaptSize(theme.spacing.small * 80)}px;
        padding-bottom: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;

export const Header = styled.View<HeaderProps>`
    align-items: center;
    display: flex;
    flex-direction: row;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 9 + theme.spacing.extraSmall)}px;
        padding: ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px
            ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px
            ${theme.adaptSize(theme.spacing.medium)}px
            ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}

    ${({theme, back}) =>
        !back &&
        css`
            padding-left: ${theme.adaptSize(theme.spacing.large)}px;
        `}
`;

export const HeadlineText = styled(Typography)`
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        margin-top: ${theme.spacing.extraSmall - 2}px;
    `}
`;

export const Icon = styled.View`
    align-items: center;
    display: flex;
    justify-content: center;
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        width: ${theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const BackAffordance = styled(Icon)``;
export const CloseAffordance = styled(Icon)``;
export const Content = styled.View`
    flex: 1;
`;

export const Button = styled.View``;
export const PrimaryButton = styled(Button)``;
export const SecondaryButton = styled(Button)``;
export const Footer = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
        min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        padding: ${theme.adaptSize(theme.spacing.medium)}px
            ${theme.adaptSize(theme.spacing.large)}px ${theme.adaptSize(theme.spacing.none)}px;
    `}
`;
