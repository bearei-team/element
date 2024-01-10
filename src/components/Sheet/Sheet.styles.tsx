import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './SheetBase';

export type InnerProps = Pick<RenderProps, 'position'>;
export type HeaderProps = Pick<RenderProps, 'back'>;

export const Modal = styled.View`
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2048;
`;

export const Container = styled(View)`
    flex: 1;
    position: relative;
`;

export const Inner = styled(Shape)<InnerProps>`
    position: absolute;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surfaceContainerLow};
        height: 100%;
        padding-bottom: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.small * 40)}px;
    `}

    ${({theme, position = 'horizontalEnd'}) => {
        const innerPosition = {
            horizontalStart: css`
                left: ${theme.adaptSize(theme.spacing.none)}px;
                top: ${theme.adaptSize(theme.spacing.none)}px;
            `,
            horizontalEnd: css`
                right: ${theme.adaptSize(theme.spacing.none)}px;
                top: ${theme.adaptSize(theme.spacing.none)}px;
            `,
            verticalEnd: css`
                bottom: ${theme.adaptSize(theme.spacing.none)}px;
                left: ${theme.adaptSize(theme.spacing.none)}px;
            `,
        };

        return innerPosition[position];
    }}
`;

export const Header = styled.View<HeaderProps>`
    align-items: center;
    display: flex;
    flex-direction: row;

    ${({theme}) => css`
        height: ${theme.adaptSize(
            theme.spacing.small * 9 + theme.spacing.extraSmall,
        )}px;

        padding: ${theme.adaptSize(
                theme.spacing.medium - theme.spacing.extraSmall,
            )}px
            ${theme.adaptSize(
                theme.spacing.medium - theme.spacing.extraSmall,
            )}px
            ${theme.adaptSize(theme.spacing.medium)}px
            ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}

    ${({theme, back}) =>
        !back &&
        css`
            padding-left: ${theme.adaptSize(theme.spacing.large)}px;
        `}
`;

export const HeadlineText = styled.Text`
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        font-size: ${theme.adaptFontSize(theme.typography.title.large.size)}px;
        font-style: ${theme.typography.title.large.style};
        font-weight: ${theme.typography.title.large.weight};
        height: ${theme.adaptSize(theme.typography.title.large.lineHeight)}px;
        letter-spacing: ${theme.adaptSize(
            theme.typography.title.large.letterSpacing,
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography.title.large.lineHeight,
        )}px;
    `}
`;

export const Icon = styled.View`
    align-items: center;
    display: flex;
    justify-content: center;
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        width: ${theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const BackAffordance = styled(Icon)``;
export const CloseAffordance = styled(Icon)``;
export const Content = styled.ScrollView`
    flex: 1;
`;

export const Button = styled.View``;
export const PrimaryButton = styled(Button)``;
export const SecondaryButton = styled(Button)``;
export const Footer = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
        min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        padding: ${theme.adaptSize(theme.spacing.medium)}px
            ${theme.adaptSize(theme.spacing.large)}px
            ${theme.adaptSize(theme.spacing.none)}px;
    `}
`;
