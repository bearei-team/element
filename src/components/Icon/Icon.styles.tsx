import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './IconBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;

export const Container = styled(View)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1;

    ${({width, height, theme}) => css`
        max-height: ${height ?? theme.adaptSize(theme.spacing.small * 6)}px;
        max-width: ${width ?? theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;
