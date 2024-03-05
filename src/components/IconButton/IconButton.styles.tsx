import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './IconButtonBase';

type ContainerProps = Pick<RenderProps, 'renderStyle'>;

export const Container = styled(View)<ContainerProps>`
    ${({renderStyle = {}, theme}) => {
        const {height, width} = renderStyle;

        return css`
            height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
            width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
        `;
    }};
`;

export const Content = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
    z-index: 1;

    ${({renderStyle = {}, theme}) => {
        const {height, width} = renderStyle;

        return css`
            height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
            width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
        `;
    }};
`;

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;
