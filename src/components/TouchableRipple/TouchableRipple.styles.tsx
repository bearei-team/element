import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Shape)`
    overflow: hidden;

    ${({theme}) =>
        theme.OS === 'web' &&
        css`
            display: inline-block;
        `}
`;

export const Content = styled(Pressable)``;
export const Inner = styled.View`
    position: relative;
`;
