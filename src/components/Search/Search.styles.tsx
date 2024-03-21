import {TextInput} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './SearchBase';

type InnerProps = {
    trailingShow: boolean;
};

type SearchListProps = {
    containerPageX?: number;
    containerPageY?: number;
    containerHeight?: number;
    renderStyle?: {
        width?: number;
    };
    visible?: boolean;
} & Pick<RenderProps, 'type'>;

export const Container = styled(Shape)`
    overflow: hidden;
`;

export const Inner = styled.Pressable<InnerProps>`
    align-items: center;
    cursor: text;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

    ${({theme}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            background-color: ${theme.palette.surface.surfaceContainerHigh};
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        `};

    ${({theme, trailingShow}) =>
        !trailingShow &&
        css`
            padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
        `}
`;

export const Leading = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        width: ${theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const Content = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex: 1;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        `};
`;

export const TextField = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;

    ${({theme}) => css`
        height: ${theme.adaptFontSize(theme.typography.body.large.lineHeight)}px;
    `};
`;

export const Input = styled(TextInput)`
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
    `};

    ${({theme, secureTextEntry}) =>
        /**
         * Using secureTextEntry props in macOS with text-related styles on the input box will cause the
         * enableFocusRing setting to be invalidated. It is uncertain whether this is a bug in
         * react-native-macos or a native bug. As a temporary workaround, if you use secureTextEntry
         * in macos, it does not provide text styles.
         */
        !secureTextEntry &&
        css`
            font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
            font-style: ${theme.typography.body.large.style};
            font-weight: ${theme.typography.body.large.weight};
            letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
            padding: ${theme.spacing.none}px;
        `}
`;

export const Trailing = styled(Leading)``;
export const SearchList = styled(Shape)<SearchListProps>`
    overflow: hidden;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
    `};

    ${({containerPageX = 0, containerPageY = 0, containerHeight = 0, type}) =>
        type === 'modal' &&
        css`
            left: ${containerPageY}px;
            position: absolute;
            top: ${containerPageX + containerHeight}px;
            z-index: 7168;
        `};

    ${({renderStyle = {}, type}) => {
        const {width = 0} = renderStyle;

        return (
            type === 'modal' &&
            css`
                width: ${width}px;
            `
        );
    }}

    ${({visible}) =>
        !visible &&
        css`
            pointer-events: none;
        `};
`;
