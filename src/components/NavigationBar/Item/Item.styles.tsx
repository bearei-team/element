import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';

const Container = styled.Pressable`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    ${({theme}) => css`
        padding-bottom: ${theme.adaptSize(theme.spacing.medium)}px;
        padding-top: ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px;
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        min-width: ${theme.adaptSize(80)}px;
    `}
`;

const IconContainer = styled(Shape)`
    position: relative;

    ${({theme}) => css`
        padding-horizontal: ${theme.adaptSize(theme.spacing.large - theme.spacing.extraSmall)}px;
        padding-vertical: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

const Icon = styled(View)`
    ${({theme}) => css`
        height: ${theme.adaptSize(24)}px;
        width: ${theme.adaptSize(24)}px;
    `}
`;

const Label = styled.Text`
    ${({theme}) => css`
        /* color: ${theme.palette.error.onError}; */
        /* font-weight: ${theme.typography.label.medium.weight}; */
        font-size: ${theme.adaptFontSize(theme.typography.label.medium.size)}px;
        font-style: ${theme.typography.label.medium.style};
        letter-spacing: ${theme.adaptSize(theme.typography.label.medium.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.medium.lineHeight)}px;
    `}
`;

export {Container, Icon, IconContainer, Label};
