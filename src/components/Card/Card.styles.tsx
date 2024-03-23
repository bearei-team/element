import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './CardBase';

type ContainerProps = Pick<RenderProps, 'block'>;
type InnerProps = Pick<ContainerProps, 'block'>;

export const Container = styled(View)<ContainerProps>`
    align-items: center;
    cursor: default;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;

    ${({theme}) => {
        const os = {
            android: css`
                align-self: stretch;
            `,
            ios: css`
                align-self: stretch;
            `,
            macos: css`
                align-self: stretch;
            `,
            web: css`
                display: inline-block;
                line-height: ${theme.adaptSize(theme.spacing.none)}px;
            `,
            windows: css`
                align-self: stretch;
            `,
        };

        return os[theme.OS];
    }}

    ${({block}) =>
        block &&
        css`
            width: 100%;
        `}
`;

export const Inner = styled.View<InnerProps>`
    position: relative;
    z-index: 1;

    ${({theme}) =>
        css`
            min-width: ${theme.adaptSize(theme.spacing.small * 45)}px;
        `}

    ${({block}) =>
        block &&
        css`
            width: 100%;
        `}
`;

export const Media = styled(Shape)`
    align-self: stretch;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 24)}px;
        `}
`;

export const Content = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) =>
        css`
            padding: ${theme.adaptSize(theme.spacing.medium)}px;
            gap: ${theme.adaptSize(theme.spacing.extraLarge)}px;
        `}
`;

export const ContentHeader = styled.View`
    align-self: stretch;
`;

export const TitleText = styled(Typography)`
    pointer-events: none;
`;

export const SubheadText = styled(Typography)`
    pointer-events: none;
`;

export const SupportingText = styled(Typography)`
    align-self: stretch;
    height: auto;
    pointer-events: none;
`;

export const ContentFooter = styled.View`
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    ${({theme}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.small)}px;
        `}
`;

export const Button = styled.View``;
export const PrimaryButton = styled(Button)``;
export const SecondaryButton = styled(Button)``;
