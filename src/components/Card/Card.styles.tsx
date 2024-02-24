import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './CardBase';

export interface ContainerProps extends Pick<RenderProps, 'block'> {
    renderStyle: {
        width?: number;
    };
}

export type InnerProps = ContainerProps;

export const Container = styled(View)<ContainerProps>`
    ${({block, renderStyle}) => {
        const {width = 0} = renderStyle;

        return block
            ? css`
                  width: 100%;
              `
            : css`
                  width: ${width}px;
              `;
    }}
`;

export const Inner = styled(Shape)<InnerProps>`
    position: relative;

    ${({theme}) =>
        css`
            min-width: ${theme.adaptSize(theme.spacing.small * 45)}px;
        `}

    ${({block, renderStyle}) => {
        const {width = 0} = renderStyle;

        return (
            block &&
            css`
                width: ${width}px;
            `
        );
    }}
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

export const TitleText = styled(Typography)``;
export const SubheadText = styled(Typography)``;
export const SupportingText = styled(Typography)`
    align-self: stretch;
    height: auto;
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
