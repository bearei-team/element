import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {IconProps} from './Icon';

export type ContainerProps = Pick<IconProps, 'width' | 'height'>;

const Container = styled(View)<ContainerProps>`
    display: flex;

    ${({width, height}) => css`
        height: ${height}px;
        width: ${width}px;
    `}
`;

export {Container};
