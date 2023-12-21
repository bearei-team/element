import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    align-items: center;
    display: flex;
    justify-content: center;

    ${({theme}) => css`
        min-height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        min-width: ${theme.adaptSize(theme.spacing.small * 11)}px;
        padding: ${theme.adaptSize(theme.spacing.none)}px
            ${theme.adaptSize(theme.spacing.medium)}px;
    `}
`;

export const LabelText = styled.Text`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(
            theme.typography.label.large.letterSpacing,
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography.label.large.lineHeight,
        )}px;
    `}
`;
