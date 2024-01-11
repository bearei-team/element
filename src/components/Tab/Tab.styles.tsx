import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export interface ActiveIndicatorProps {
    offsetPosition: 'left' | 'right';
    paddingHorizontal: number;
    width: number;
}

export interface ContentItemProps {
    width: number;
}

export const Container = styled(View)`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

export const Header = styled.View`
    align-self: stretch;
`;

export const HeaderScrollView = styled.ScrollView``;
export const HeaderInner = styled.View<ContentItemProps>`
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;

    ${({width = 0}) => css`
        width: ${width}px;
    `};
`;

export const ActiveIndicator = styled.View<ActiveIndicatorProps>`
    bottom: 0;
    display: flex;
    flex-direction: row;
    position: absolute;

    ${({theme, width = 0, paddingHorizontal = 0}) => css`
        width: ${width}px;
        padding: ${theme.spacing.none}px ${paddingHorizontal}px;
    `};

    ${({offsetPosition}) =>
        offsetPosition === 'left'
            ? css`
                  justify-content: flex-start;
              `
            : css`
                  justify-content: flex-end;
              `};
`;

export const ActiveIndicatorInner = styled(Shape)`
    ${({theme}) => css`
        background-color: ${theme.palette.primary.primary};
        height: ${theme.adaptSize(theme.spacing.extraSmall - 1)}px;
    `};
`;

export const Content = styled.View`
    align-self: stretch;
    flex: 1;
    overflow: hidden;
    position: relative;

    ${({theme}) => css`
        min-height: ${theme.adaptSize(theme.spacing.small * 9)}px;
    `};
`;

export const ContentInner = styled.View`
    display: flex;
    flex-direction: row;
    height: 100%;
    position: absolute;
    top: 0;
`;

export const ContentItem = styled.View<ContentItemProps>`
    ${({width = 0}) => css`
        width: ${width}px;
    `};
`;
