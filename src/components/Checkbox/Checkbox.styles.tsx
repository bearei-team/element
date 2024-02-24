import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export interface ContainerProps {
    renderStyle?: {
        width?: number;
    };
}

export const Container = styled(View)<ContainerProps>`
    ${({renderStyle = {}}) => {
        const {width = 0} = renderStyle;

        return css`
            width: ${width}px;
        `;
    }}
`;

export const Content = styled(Shape)`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;

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
