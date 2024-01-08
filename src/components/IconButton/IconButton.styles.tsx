import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './IconButtonBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;

export interface ContentProps extends Pick<RenderProps, 'type'> {
    iconShow: boolean;
}

export const Container = styled(View)<ContainerProps>`
    ${({width, height, theme}) => css`
        max-height: ${height ?? theme.adaptSize(theme.spacing.small * 6)}px;
        max-width: ${width ?? theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const Content = styled(Shape)<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
`;

export const Icon = styled.View`
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}
`;
