import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Typography, TypographyProps} from '../../Common/Common.styles';
import {RenderProps} from './NavigationBarItemBase';

type ContainerProps = Pick<RenderProps, 'active'>;
type LabelTextProps = Pick<RenderProps, 'active'> & TypographyProps;
type HeaderProps = Pick<RenderProps, 'type'>;

export const Container = styled(View)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 10)}px;
        max-width: ${theme.adaptSize(theme.spacing.small * 16)}px;
        min-width: ${theme.adaptSize(theme.spacing.small * 9)}px;
    `}

    ${({theme, active}) =>
        active &&
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `}
`;

export const Header = styled.View<HeaderProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
    z-index: 1;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.extraLarge)}px;
        width: ${theme.adaptSize(theme.spacing.small * 8)}px;
    `};

    ${({theme, type}) =>
        type === 'block' &&
        css`
            height: ${theme.adaptSize(theme.spacing.small * 8)}px;
        `};
`;

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;

export const LabelText = styled(Typography)<LabelTextProps>`
    overflow: hidden;
    pointer-events: none;
    user-select: none;

    ${({theme, active}) => css`
        font-weight: ${active ? theme.font.weight.bold : theme.font.weight.medium};
    `}
`;
