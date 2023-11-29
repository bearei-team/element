import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {IconProps} from './Icon';

export type ContainerProps = Pick<IconProps, 'width' | 'height'>;

export const Container = styled(View)<ContainerProps>`
    display: flex;
    flex: 1;

    ${({width, height}) => css`
        height: ${height}px;
        width: ${width}px;
    `}
`;
