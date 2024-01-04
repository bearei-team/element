import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './IconBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;

export const Container = styled(View)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;

    ${({width, height, theme}) => css`
        max-height: ${height ?? theme.adaptSize(theme.spacing.small * 6)}px;
        max-width: ${width ?? theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;
