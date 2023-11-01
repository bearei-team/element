import styled, {css} from 'styled-components/native';
import {DividerProps} from './Divider';

export type ContainerProps = Pick<DividerProps, 'layout' | 'size'>;

export const Container = styled.View<ContainerProps>`
    ${({layout = 'horizontal'}) => {
        const themeType = {
            horizontal: css`
                width: 320px;
                height: 1px;
            `,
            vertical: css`
                width: 1px;
                height: 120px;
            `,
        };

        return themeType[layout];
    }}

    ${({theme, size = 'medium', layout = 'horizontal'}) => {
        const themeType = {
            large: css``,

            medium:
                layout === 'horizontal'
                    ? css`
                          padding-start: ${theme.spacing.medium}px;
                      `
                    : css`
                          padding-top: ${theme.spacing.medium}px;
                      `,

            small:
                layout === 'horizontal'
                    ? css`
                          padding-horizontal: ${theme.spacing.medium}px;
                      `
                    : css`
                          padding-vertical: ${theme.spacing.medium}px;
                      `,
        };

        return themeType[size];
    }}
`;

export const Main = styled.View`
    flex: 1;

    ${({theme}) => css`
        background-color: ${theme.palette.outline.outlineVariant};
    `}
`;
