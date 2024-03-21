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

    ${({theme}) =>
        theme.OS === 'web' &&
        css`
            display: inline-block;
        `}
`;

export const Inner = styled(Pressable)`
    align-self: stretch;
    flex: 1;
    position: relative;
`;

export const Content = styled.View`
    position: absolute;
`;
