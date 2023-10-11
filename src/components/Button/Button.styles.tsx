import styled, {css} from 'styled-components/native';
import {BasicButtonProps, ButtonChildrenProps} from './Basic';
import {Animated} from 'react-native';

export type LayerProps = Pick<BasicButtonProps, 'type'>;
export type MainProps = Pick<BasicButtonProps & ButtonChildrenProps, 'type' | 'state'>;

export const Container = styled.Pressable`
    position: relative;
`;

export const Layer = styled(Animated.View)<LayerProps>`
    ${({theme}) => css`
        border-top-left-radius: ${theme.shape.full.topLeft}px;
        border-top-right-radius: ${theme.shape.full.topRight}px;
        border-bottom-left-radius: ${theme.shape.full.bottomLeft}px;
        border-bottom-right-radius: ${theme.shape.full.bottomRight}px;
    `}
`;

export const Layer0 = styled(Layer)`
    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                background-color: ${theme.palette.primary.primary};
            `,

            outlined: css`
                border-width: 1px;
                border-style: solid;
                border-color: ${theme.palette.outline.outline};
            `,

            text: css``,
        };

        return themeType[type];
    }}
`;

export const Layer1 = styled(Layer)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        gap: ${theme.spacing.small}px;
    `}

    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                padding-block: ${theme.spacing.small + 2}px;
                padding-inline: ${theme.spacing.large}px;
            `,

            outlined: css``,

            text: css``,
        };

        return themeType[type];
    }}
`;

export const Layer2 = styled(Layer)`
    position: absolute;
    width: 100%;
    height: 100%;
`;

export const Shadow0 = styled(Layer2)`
    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                shadow-color: ${theme.palette.shadow.shadow};
                shadow-offset: ${theme.elevation.level1.shadow0.x}px
                    ${theme.elevation.level1.shadow1.y}px;

                shadow-radius: ${theme.elevation.level1.shadow0.blur}px;
                shadow-opacity: ${theme.elevation.level1.shadow0.opacity};
            `,

            outlined: css``,

            text: css``,
        };

        return themeType[type];
    }}
`;

export const Shadow1 = styled(Layer2)`
    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                shadow-color: ${theme.palette.shadow.shadow};
                shadow-color: ${theme.palette.shadow.shadow};
                shadow-offset: ${theme.elevation.level1.shadow1.x}px
                    ${theme.elevation.level1.shadow1.y}px;

                shadow-radius: ${theme.elevation.level1.shadow1.blur}px;
                shadow-opacity: ${theme.elevation.level1.shadow0.opacity};
            `,

            outlined: css``,

            text: css``,
        };

        return themeType[type];
    }}
`;

export const Main = styled.Text<MainProps>`
    ${({theme}) => css`
        font-size: ${theme.typography.label.large.size}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        line-height: ${theme.typography.label.large.lineHeight}px;
        letter-spacing: ${theme.typography.label.large.letterSpacing}px;
        text-align: center;
    `}

    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                color: ${theme.palette.primary.onPrimary};
            `,

            outlined: css``,

            text: css``,
        };

        return themeType[type];
    }}

    ${({theme, state}) =>
        state === 'disabled' &&
        css`
            color: ${theme.color.rgba({
                color: theme.palette.surface.onSurface,
                opacity: 0.38,
            })};
        `}
`;

export const Icon = styled.View`
    width: 18px;
    height: 18px;
    overflow: hidden;
`;
