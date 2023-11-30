import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './NavigationBarBase';

export type ContainerProps = Pick<RenderProps, 'layout'>;

export const Container = styled(View)<ContainerProps>`
    display: flex;

    ${({theme}) =>
        css`
            background-color: ${theme.palette.surface.surfaceContainer};
            gap: ${theme.adaptSize(theme.spacing.small)}px;
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
