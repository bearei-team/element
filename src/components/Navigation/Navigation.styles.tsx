import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './NavigationBase';

export type ContentProps = Pick<RenderProps, 'type'>;

export const Container = styled(View)<ContentProps>`
    display: flex;

    ${({theme}) =>
        css`
            background-color: ${theme.palette.surface.surfaceContainer};
            height: ${theme.adaptSize(80)}px;
        `};

    ${({theme, type = 'bar'}) => {
        const containerType = {
            bar: css`
                flex-direction: row;
                gap: ${theme.adaptSize(theme.spacing.small)}px;
                padding: ${theme.adaptSize(0)}px ${theme.adaptSize(theme.spacing.small)}px;
                justify-content: center;
            `,
            drawer: css`
                flex-direction: column;
            `,
            rail: css`
                flex-direction: column;
            `,
        };

        return containerType[type];
    }}
`;
