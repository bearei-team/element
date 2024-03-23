import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    align-items: center;
    cursor: default;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}
`;

export const Content = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
    z-index: 1;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `};
`;

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;
