import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        padding: ${theme.spacing.medium}px;
        min-width: 88px;
    `}
`;

export const LabelText = styled.Text`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.label.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.large.lineHeight)}px;
    `}
`;
