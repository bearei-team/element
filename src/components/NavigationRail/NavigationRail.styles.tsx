import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    display: flex;
    align-items: center;
    flex-direction: column;

    ${({theme}) => css`
        width: ${theme.adaptSize(theme.spacing.small * 10)}px;
        padding: ${theme.adaptSize(
                theme.spacing.small * 6 + theme.spacing.extraSmall,
            )}px
            ${theme.adaptSize(theme.spacing.none)}px
            ${theme.adaptSize(theme.spacing.small * 7)}px;
    `}
`;

export const Destination = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
        padding: ${theme.adaptSize(theme.spacing.extraSmall + 1)}px;
        width: ${theme.adaptSize(theme.spacing.small * 10)}px;
    `}
`;

export const Fab = styled.View`
    overflow: hidden;

    ${({theme}) =>
        css`
            width: ${theme.adaptSize(theme.spacing.small * 7)}px;
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            margin-top: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            margin-bottom: ${theme.adaptSize(
                theme.spacing.small * 8 - theme.spacing.extraSmall,
            )}px;
        `};
`;
