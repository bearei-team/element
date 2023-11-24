import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {IconProps} from './Icon';

export type ContainerProps = Pick<IconProps, 'width' | 'height'>;

const Container = styled(View)<ContainerProps>`
    display: flex;

    ${({width, height, theme}) => css`
        height: ${height ?? theme.adaptSize(48)}px;
        width: ${width ?? theme.adaptSize(48)}px;
    `}
`;

export {Container};
