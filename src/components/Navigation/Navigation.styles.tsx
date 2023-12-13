import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './NavigationBase';

export type ContentProps = Pick<RenderProps, 'type'>;

export const Container = styled(View)<ContentProps>`
    display: flex;

    ${({theme}) =>
        css`
            background-color: ${theme.palette.surface.surfaceContainer};
        `};

    ${({theme, type = 'bar'}) => {
        const containerType = {
            bar: css`
                flex-direction: row;
                gap: ${theme.adaptSize(theme.spacing.small)}px;
                height: ${theme.adaptSize(80)}px;
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
                width: ${theme.adaptSize(80)}px;
            `,
        };

        return containerType[type];
    }}
`;
