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

export const Item = styled.View``;
export const Icon = styled.View`
    ${({theme}) => css`
        width: ${theme.adaptSize(24)}px;
        height: ${theme.adaptSize(24)}px;
    `}
`;

export const LabelText = styled.Text`
    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.medium.size)}px;
        font-style: ${theme.typography.label.medium.style};
        letter-spacing: ${theme.adaptSize(theme.typography.label.medium.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.medium.lineHeight)}px;
    `}
`;
