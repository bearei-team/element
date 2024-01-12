import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Typography} from '../../Common/Common.styles';
import {RenderProps} from './NavigationRailItemBase';

export type ContainerProps = Pick<RenderProps, 'active'>;
export type LabelTextProps = Pick<RenderProps, 'active'>;

export const Container = styled(View)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        width: ${theme.adaptSize(theme.spacing.small * 7)}px;
    `}

    ${({theme, active}) =>
        active &&
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `}
`;

export const Header = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.extraLarge)}px;
        width: ${theme.adaptSize(theme.spacing.small * 7)}px;
    `};
`;

export const Icon = styled.View`
    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;

export const LabelText = styled(Typography)<LabelTextProps>`
    user-select: none;
    overflow: hidden;

    ${({theme, active}) => css`
        font-weight: ${active ? theme.font.weight.bold : theme.font.weight.medium};
    `}
`;
