import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './TouchableRippleBase';

type ContainerProps = Pick<RenderProps, 'block'>;

export const Container = styled(Shape)<ContainerProps>`
    overflow: hidden;

    ${({theme}) =>
        theme.OS === 'web' &&
        css`
            display: block;
        `}

    ${({block}) =>
        block &&
        css`
            align-self: stretch;
            flex: 1;
            width: 100%;
        `}
`;

export const Content = styled(Pressable)``;
export const Inner = styled.View`
    position: relative;
`;
