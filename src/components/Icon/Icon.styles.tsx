import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './IconBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;

export const Container = styled(View)<ContainerProps>`
    display: flex;
    flex: 1;

    ${({width, height}) => css`
        height: ${height}px;
        width: ${width}px;
    `}
`;
