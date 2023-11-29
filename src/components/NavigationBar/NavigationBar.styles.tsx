import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {NavigationBarProps} from './NavigationBar';

export type ContainerProps = Pick<NavigationBarProps, 'layout'>;

export const Container = styled(View)<ContainerProps>`
    display: flex;

    ${({theme}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.small)}px;
            background-color: ${theme.palette.surface.surfaceContainer};
        `};

    ${({layout = 'horizontal'}) =>
        layout === 'horizontal'
            ? css`
                  flex-direction: row;
              `
            : css`
                  flex-direction: column;
              `};
`;
