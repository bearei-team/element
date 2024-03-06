import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

interface ContainerProps {
    renderStyle?: {height?: number; width?: number};
}

export const Container = styled(Shape)<ContainerProps>`
    display: flex;
    overflow: hidden;
    flex-direction: row;

    ${({renderStyle = {}}) => {
        const {width = 0, height = 0} = renderStyle;

        return css`
            height: ${height}px;
            width: ${width}px;
        `;
    }}
`;

export const Inner = styled(Pressable)`
    align-self: stretch;
    flex: 1;
    position: relative;
`;

export const Content = styled.View`
    position: absolute;
`;
