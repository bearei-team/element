import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './TabBase';

export interface ActiveIndicatorProps extends Pick<RenderProps, 'activeIndicatorOffsetPosition'> {
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
    flex: 1;
    overflow: hidden;
    position: relative;
`;

export const Header = styled.View``;
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
    display: flex;
    flex-direction: row;
    position: absolute;

    ${({theme, width = 0, paddingHorizontal = 0}) => css`
        bottom: ${theme.adaptSize(theme.spacing.none)}px;
        width: ${width}px;
        padding: ${theme.spacing.none}px ${paddingHorizontal}px;
    `};

    ${({activeIndicatorOffsetPosition}) =>
        activeIndicatorOffsetPosition === 'horizontalStart'
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

export const Content = styled.Pressable`
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

    ${({theme}) =>
        css`
            top: ${theme.adaptSize(theme.spacing.none)}px;
        `}
`;

export const ContentItem = styled.View<ContentItemProps>`
    ${({width = 0}) => css`
        width: ${width}px;
    `};
`;
