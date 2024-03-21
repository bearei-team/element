import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

interface ContainerProps {
    renderStyle?: {height?: number; width?: number};
}

export const Container = styled(Shape)<ContainerProps>`
    ${({theme}) =>
        theme.OS === 'web' &&
        css`
            display: inline-block;
        `}
`;

export const Content = styled(Pressable)``;
