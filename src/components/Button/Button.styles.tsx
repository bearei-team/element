import {TouchableWithoutFeedback} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ButtonBase';

export type ContentProps = Pick<RenderProps, 'type' | 'iconShow' | 'category'>;
export type LabelTextProps = Omit<ContentProps, 'iconShow'>;
export type IconProps = Pick<ContentProps, 'category'>;

export const Container = styled(TouchableWithoutFeedback)``;
export const Inner = styled.View``;
export const Content = styled(Shape)<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({theme, type = 'filled'}) => {
        const containerType = {
            elevated: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            filled: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            outlined: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            text: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.medium - 4)}px;
            `,
            tonal: css`
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
        };

        return containerType[type];
    }}

    ${({iconShow, theme, type = 'filled'}) => {
        const containerType = {
            elevated: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            filled: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            outlined: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            text: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium - 4)}px;
                padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            tonal: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
        };

        return iconShow && containerType[type];
    }}

    ${({theme, category = 'button'}) => {
        const categoryType = {
            button: css`
                height: ${theme.adaptSize(40)}px;
            `,
            iconButton: css`
                width: ${theme.adaptSize(40)}px;
                height: ${theme.adaptSize(40)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px;
            `,
        };

        return categoryType[category];
    }}
`;

export const LabelText = styled.Text<LabelTextProps>`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.label.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.large.lineHeight)}px;
    `}
`;

export const Icon = styled.View<IconProps>`
    overflow: hidden;

    ${({theme, category = 'button'}) => {
        const categoryType = {
            button: css`
                height: ${theme.adaptSize(18)}px;
                width: ${theme.adaptSize(18)}px;
            `,
            iconButton: css`
                height: ${theme.adaptSize(24)}px;
                width: ${theme.adaptSize(24)}px;
            `,
        };

        return categoryType[category];
    }}
`;
