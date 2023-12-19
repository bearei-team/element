import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export interface HeaderInnerProps {
    width: number;
}

export interface ActiveIndicatorProps extends HeaderInnerProps {
    offsetPosition: 'left' | 'right';
    paddingHorizontal: number;
}

export interface ContentItemProps extends HeaderInnerProps {}

export const Container = styled(View)`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const Header = styled.ScrollView``;
export const HeaderInner = styled.View<HeaderInnerProps>`
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({width}) => css`
        width: ${width}px;
    `};
`;

export const HeaderContent = styled.View`
    display: flex;
    flex-direction: row;
`;

export const ActiveIndicator = styled.View<ActiveIndicatorProps>`
    bottom: 0;
    display: flex;
    flex-direction: row;
    position: absolute;

    ${({width, theme, paddingHorizontal}) => css`
        width: ${width}px;
        padding: ${theme.adaptSize(theme.spacing.none)}px ${paddingHorizontal}px;
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
    flex: 1;
    overflow: hidden;
    position: relative;
    width: 100%;
`;

export const ContentInner = styled.View`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    position: absolute;
    top: 0;
`;

export const ContentItem = styled.View<ContentItemProps>`
    ${({width}) => css`
        width: ${width}px;
    `};
`;
