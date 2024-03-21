import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    ${({theme}) =>
        theme.OS === 'web' &&
        css`
            display: inline-block;
            line-height: ${theme.adaptSize(theme.spacing.none)}px;
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
