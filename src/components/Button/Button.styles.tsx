import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {ButtonProps} from './Button';

export type ContainerProps = Pick<ButtonProps, 'type'> & {showIcon: boolean};
export type LabelProps = Omit<ContainerProps, 'showIcon'>;

const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        gap: ${theme.spacing.small}px;
    `}

    ${({theme, type = 'filled'}) => {
        const mainType = {
            elevated: css`
                padding-horizontal: ${theme.spacing.large}px;
                padding-vertical: ${theme.spacing.small + 2}px;
            `,
            filled: css`
                padding-horizontal: ${theme.spacing.large}px;
                padding-vertical: ${theme.spacing.small + 2}px;
            `,
            outlined: css`
                padding-horizontal: ${theme.spacing.large}px;
                padding-vertical: ${theme.spacing.small + 2}px;
            `,
            text: css`
                padding-horizontal: ${theme.spacing.medium - 4}px;
                padding-vertical: ${theme.spacing.small + 2}px;
            `,
            tonal: css`
                padding-horizontal: ${theme.spacing.large}px;
                padding-vertical: ${theme.spacing.small + 2}px;
            `,
        };

        return mainType[type];
    }}

    ${({showIcon, theme, type = 'filled'}) => {
        const mainType = {
            elevated: css`
                padding-start: ${theme.spacing.medium}px;
            `,
            filled: css`
                padding-start: ${theme.spacing.medium}px;
            `,
            outlined: css`
                padding-start: ${theme.spacing.medium}px;
            `,
            text: css`
                padding-horizontal-end: ${theme.spacing.medium}px;
                padding-start: ${theme.spacing.medium - 4}px;
            `,
            tonal: css`
                padding-start: ${theme.spacing.medium}px;
            `,
        };

        return showIcon && mainType[type];
    }}
`;

const Label = styled.Text<LabelProps>`
    ${({theme}) => css`
        font-size: ${theme.typography.label.large.size}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.typography.label.large.letterSpacing}px;
        line-height: ${theme.typography.label.large.lineHeight}px;
    `}
`;

const Icon = styled.View`
    height: 18px;
    overflow: hidden;
    width: 18px;
`;

export {Container, Icon, Label};
