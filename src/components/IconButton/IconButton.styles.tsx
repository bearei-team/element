import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './IconButtonBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;
export type ContentProps = ContainerProps;

export const Container = styled(View)<ContainerProps>`
    ${({width, height, theme}) => css`
        height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
    `};
`;

export const Content = styled(Shape)<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;

    ${({width, height, theme}) => css`
        height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
    `};
`;

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;
