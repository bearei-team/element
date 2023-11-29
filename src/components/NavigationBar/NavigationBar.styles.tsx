import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {NavigationBarProps} from './NavigationBar';

export type ContainerProps = Pick<NavigationBarProps, 'layout'>;

const Container = styled(View)<ContainerProps>`
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

const Item = styled.View``;

const Icon = styled.View`
    width: 24px;
    height: 24px;
`;

const Label = styled.Text`
    ${({theme}) => css`
        /* color: ${theme.palette.error.onError}; */
        font-size: ${theme.adaptFontSize(theme.typography.label.medium.size)}px;
        font-style: ${theme.typography.label.medium.style};
        /* font-weight: ${theme.typography.label.medium.weight}; */
        letter-spacing: ${theme.adaptSize(theme.typography.label.medium.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.medium.lineHeight)}px;
    `}
`;

export {Container, Icon, Item, Label};
