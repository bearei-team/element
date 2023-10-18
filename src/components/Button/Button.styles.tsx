import styled, {css} from 'styled-components/native';
import {BasicButtonProps, ButtonChildrenProps} from './Basic';
import {Animated} from 'react-native';

export type Layer0Props = Pick<BasicButtonProps, 'type'> & Pick<ButtonChildrenProps, 'state'>;
export interface Layer1Props extends Omit<Layer0Props, 'state'> {
    showIcon: boolean;
}

export type ShadowProps = Pick<Layer1Props, 'type'>;
export type MainProps = Layer0Props;

export const Container = styled.Pressable`
    position: relative;
    height: 40px;
`;

export const Layer = styled(Animated.View)`
    ${({theme}) => css`
        border-top-left-radius: ${theme.shape.full.topLeft}px;
        border-top-right-radius: ${theme.shape.full.topRight}px;
        border-bottom-left-radius: ${theme.shape.full.bottomLeft}px;
        border-bottom-right-radius: ${theme.shape.full.bottomRight}px;
    `}
`;

export const Layer0 = styled(Layer)<Layer0Props>`
    ${({theme, type, state}) => {
        const themeType = {
            filled:
                state !== 'disabled' &&
                css`
                    background-color: ${theme.palette.primary.primary};
                `,

            outlined: css`
                border-width: 1px;
                border-style: solid;
            `,

            text: css``,

            elevated:
                state !== 'disabled' &&
                css`
                    background-color: ${theme.palette.surface.surfaceContainerLow};
                `,
        };

        return themeType[type!];
    }}
`;

export const Layer1 = styled(Layer)<Layer1Props>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        gap: ${theme.spacing.small}px;
    `}

    ${({theme, type, showIcon}) => {
        const themeType = {
            filled: !showIcon
                ? css`
                      padding-block: ${theme.spacing.small + 2}px;
                      padding-inline: ${theme.spacing.large}px;
                  `
                : css`
                      padding-block: ${theme.spacing.small + 2}px;
                      padding-inline-start: ${theme.spacing.medium}px;
                      padding-inline-end: ${theme.spacing.large}px;
                  `,

            outlined: !showIcon
                ? css`
                      padding-block: ${theme.spacing.small + 2}px;
                      padding-inline: ${theme.spacing.large}px;
                  `
                : css`
                      padding-block: ${theme.spacing.small + 2}px;
                      padding-inline-start: ${theme.spacing.medium}px;
                      padding-inline-end: ${theme.spacing.large}px;
                  `,

            text: !showIcon
                ? css`
                      padding-block: ${theme.spacing.small + 2}px;
                      padding-inline: ${theme.spacing.medium - 2}px;
                  `
                : css`
                      padding-block: ${theme.spacing.small + 2}px;
                      padding-inline-start: ${theme.spacing.medium - 2}px;
                      padding-inline-end: ${theme.spacing.medium}px;
                  `,

            elevated: css``,
        };

        return themeType[type!];
    }}
`;

export const Layer2 = styled(Layer)`
    position: absolute;
    width: 100%;
    height: 100%;
`;

export const Shadow0 = styled(Layer2)<ShadowProps>`
    ${({theme, type}) => {
        const themeType = {
            filled: css`
                shadow-color: ${theme.palette.shadow.shadow};
                shadow-offset: ${theme.elevation.level1.shadow0.x}px
                    ${theme.elevation.level1.shadow1.y}px;

                shadow-radius: ${theme.elevation.level1.shadow0.blur}px;
                shadow-opacity: ${theme.elevation.level1.shadow0.opacity};
                elevation: ${theme.elevation.level1.shadow0.elevation};
            `,

            outlined: css``,

            text: css``,

            elevated: css``,
        };

        return themeType[type!];
    }}
`;

export const Shadow1 = styled(Layer2)<ShadowProps>`
    ${({theme, type}) => {
        const themeType = {
            filled: css`
                shadow-color: ${theme.palette.shadow.shadow};
                shadow-offset: ${theme.elevation.level1.shadow1.x}px
                    ${theme.elevation.level1.shadow1.y}px;

                shadow-radius: ${theme.elevation.level1.shadow1.blur}px;
                shadow-opacity: ${theme.elevation.level1.shadow1.opacity};
                elevation: ${theme.elevation.level1.shadow1.elevation};
            `,

            outlined: css``,

            text: css``,

            elevated: css``,
        };

        return themeType[type!];
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

    ${({theme, type, state}) => {
        const disabledCss = css`
            color: ${theme.palette.surface.onSurface};
            opacity: 0.38;
        `;

        const themeType = {
            filled:
                state !== 'disabled'
                    ? css`
                          color: ${theme.palette.primary.onPrimary};
                      `
                    : disabledCss,

            outlined:
                state !== 'disabled'
                    ? css`
                          color: ${theme.palette.primary.primary};
                      `
                    : disabledCss,

            text:
                state !== 'disabled'
                    ? css`
                          color: ${theme.palette.primary.primary};
                      `
                    : disabledCss,

            elevated:
                state !== 'disabled'
                    ? css`
                          color: ${theme.palette.primary.primary};
                      `
                    : disabledCss,
        };

        return themeType[type!];
    }}
`;

export const Icon = styled.View<MainProps>`
    width: 18px;
    height: 18px;
    overflow: hidden;

    ${({state}) =>
        state === 'disabled' &&
        css`
            opacity: 0.38;
        `}
`;
