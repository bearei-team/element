import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {TextFieldProps} from './TextField';

export type MainProps = Pick<TextFieldProps, 'type'> & {
    trailingIconShow: boolean;
    leadingIconShow: boolean;
};
export type LabelProps = Pick<TextFieldProps, 'type'>;
export type SupportingTextProps = Pick<TextFieldProps, 'error'>;

const Container = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) => css`
        gap: ${theme.spacing.extraSmall}px;
    `}
`;

const Core = styled.View``;
const CoreInner = styled.Pressable``;

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

    ${({theme, leadingIconShow}) =>
        !leadingIconShow &&
        css`
            padding-start: ${theme.spacing.medium}px;
        `}


    ${({theme, trailingIconShow}) =>
        !trailingIconShow &&
        css`
            padding-end: ${theme.spacing.medium}px;
        `}
`;

const Content = styled.View`
    display: flex;
    flex-direction: column;
    flex: 1;
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
        color: ${theme.palette.surface.onSurface};
        font-size: ${theme.typography.body.large.size}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.typography.body.large.letterSpacing}px;
        line-height: ${theme.typography.body.large.lineHeight}px;
        outline-style: none;
    `}
`;

const ActiveIndicator = styled.View`
    bottom: 0;
    left: 0;
    position: absolute;
    width: 100%;
`;

const Icon = styled.View`
    align-items: center;
    display: flex;
    height: 48px;
    justify-content: center;
    width: 48px;

    ${({theme}) => css`
        padding-horizontal: ${theme.spacing.small}px;
        padding-vertical: ${theme.spacing.small}px;
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

export {
    ActiveIndicator,
    Container,
    Content,
    Core,
    CoreInner,
    Input,
    Label,
    LeadingIcon,
    Main,
    SupportingText,
    TrailingIcon,
};
