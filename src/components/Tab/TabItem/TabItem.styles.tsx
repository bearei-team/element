import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Typography} from '../../Common/Common.styles';

export const Container = styled(View)`
    flex: 1;
`;

export const Inner = styled(View)`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    pointer-events: none;
    position: relative;

    ${({theme}) => css`
        min-height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
        padding: ${theme.adaptSize(theme.spacing.none)}px ${theme.adaptSize(theme.spacing.medium)}px;
    `}
`;

export const LabelText = styled(Typography)`
    user-select: none;
`;
