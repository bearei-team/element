import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './IconBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;

export const Container = styled(Pressable)<ContainerProps>`
    display: flex;
    flex: 1;

    ${({width = 48, height = 48}) => css`
        max-height: ${height}px;
        max-width: ${width}px;
    `}
`;
