import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './NavigationBase';

export type ContentProps = Pick<RenderProps, 'type'>;

export type DestinationProps = Pick<RenderProps, 'type'>;

export const Container = styled(View)<ContentProps>`
    display: flex;

    ${({theme, type = 'bar'}) => {
        const containerType = {
            bar: css`
                height: ${theme.adaptSize(theme.spacing.small * 10)}px;
            `,
            drawer: css``,
            rail: css`
                align-items: center;
                flex-direction: column;
                width: ${theme.adaptSize(theme.spacing.small * 10)}px;
                padding: ${theme.adaptSize(theme.spacing.small * 6)}px
                    ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
        };

        return containerType[type];
    }}
`;

export const Destination = styled.View<DestinationProps>`
    display: flex;

    ${({theme, type = 'bar'}) => {
        const containerType = {
            bar: css`
                flex-direction: row;
                gap: ${theme.adaptSize(theme.spacing.small)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.small)}px;

                justify-content: center;
            `,
            drawer: css`
                flex-direction: column;
            `,
            rail: css`
                flex-direction: column;
                gap: ${theme.adaptSize(theme.spacing.small)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall + 1)}px;
                width: ${theme.adaptSize(theme.spacing.small * 10)}px;
            `,
        };

        return containerType[type];
    }}
`;

export const Fab = styled.View`
    overflow: hidden;

    ${({theme}) =>
        css`
            width: ${theme.adaptSize(theme.spacing.small * 7)}px;
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            margin-top: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            margin-bottom: ${theme.adaptSize(theme.spacing.small * 5)}px;
        `};
`;
