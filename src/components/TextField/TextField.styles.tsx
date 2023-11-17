import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {TextFieldProps} from './TextField';

export type MainProps = Pick<TextFieldProps, 'type'> & {trailingIconShow: boolean};
export type LabelProps = Pick<TextFieldProps, 'type'>;
export type SupportingTextProps = Pick<TextFieldProps, 'error'>;

const Container = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) => css`
        gap: ${theme.spacing.extraSmall}px;
    `}
`;

const Main = styled(Shape)<MainProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    min-height: 48px;
    position: relative;

    ${({theme}) =>
        css`
            padding-vertical: ${theme.spacing.extraSmall}px;
        `}

    ${({theme, trailingIconShow}) =>
        trailingIconShow
            ? css`
                  padding-start: ${theme.spacing.medium}px;
              `
            : css`
                  padding-horizontal: ${theme.spacing.medium}px;
              `}

    ${({theme, type = 'filled'}) => {
        const mainType = {
            filled: css`
                background-color: ${theme.palette.surface.surfaceContainerHighest};
            `,

            outlined: css`
                background-color: ${theme.palette.surface.onSurfaceVariant};
            `,
        };

        return mainType[type];
    }}
`;

export const Content = styled.View`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Label = styled.Text<LabelProps>`
    ${({theme}) => css`
        font-style: ${theme.typography.label.small.style};
        font-weight: ${theme.typography.label.small.weight};
    `};
`;

const Input = styled(TextInput)`
    ${({theme}) => css`
        font-size: ${theme.typography.body.large.size}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        line-height: ${theme.typography.body.large.lineHeight}px;
        letter-spacing: ${theme.typography.body.large.letterSpacing}px;
        color: ${theme.palette.surface.onSurface};
    `}
`;

const ActiveIndicator = styled.View`
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
`;

const Icon = styled.View`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        padding-vertical: ${theme.spacing.small}px;
        padding-horizontal: ${theme.spacing.small}px;
    `}
`;

const TrailingIcon = styled(Icon)``;
const LeadingIcon = styled(Icon)``;

const SupportingText = styled.Text<SupportingTextProps>`
    ${({theme}) => css`
        font-size: ${theme.typography.body.small.size}px;
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
        letter-spacing: ${theme.typography.body.small.letterSpacing}px;
        line-height: ${theme.typography.body.small.lineHeight}px;
        padding-horizontal: ${theme.spacing.medium}px;
    `}
`;

export {ActiveIndicator, Container, Input, Label, LeadingIcon, Main, SupportingText, TrailingIcon};
