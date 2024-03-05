import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './FABBase';

interface ContentProps extends Pick<RenderProps, 'size' | 'type'> {
    labelTextShow: boolean;
}

type IconProps = Pick<RenderProps, 'size'>;

export const Container = styled(View)``;
export const Content = styled(Shape)<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
    z-index: 1;

    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 5)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
                padding: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.small * 12)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 12)}px;
                padding: ${theme.adaptSize(theme.spacing.extraLarge - 2)}px;
            `,
        };

        return contentSize[size];
    }}

    ${({theme, labelTextShow}) =>
        labelTextShow &&
        css`
            gap: ${theme.adaptSize(theme.spacing.small + theme.spacing.extraSmall)}px;
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
            padding: ${theme.adaptSize(theme.spacing.medium)}px
                ${theme.adaptSize(theme.spacing.large - theme.spacing.extraSmall)}px
                ${theme.adaptSize(theme.spacing.medium)}px
                ${theme.adaptSize(theme.spacing.medium)}px;
        `}
`;

export const LabelText = styled(Typography)`
    text-align: center;
    user-select: none;
`;

export const Icon = styled.View<IconProps>`
    overflow: hidden;

    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.extraLarge + theme.spacing.extraSmall)}px;
                width: ${theme.adaptSize(theme.spacing.extraLarge + theme.spacing.extraSmall)}px;
            `,
        };

        return contentSize[size];
    }}
`;
