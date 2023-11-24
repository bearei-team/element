import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {IconProps} from './Icon';

export type ContainerProps = Pick<IconProps, 'width' | 'height'>;

const Container = styled(View)<ContainerProps>`
    display: flex;

    ${({width = 48, height = 48, theme}) => css`
        height: ${theme.adaptSize(height)}px;
        width: ${theme.adaptSize(width)}px;
    `}
`;

export {Container};
