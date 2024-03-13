import {TextInput} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './SearchBase';

type InnerProps = {
    trailingShow: boolean;
} & Pick<RenderProps, 'size'>;

type SearchListProps = {
    containerPageX?: number;
    containerPageY?: number;
    containerHeight?: number;
    renderStyle?: {
        width?: number;
    };
    visible?: boolean;
} & Pick<RenderProps, 'type'>;

type LeadingProps = Pick<RenderProps, 'size'>;
type InputProps = Pick<RenderProps, 'size'>;

export const Container = styled(Shape)`
    align-self: stretch;
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
        `};

    ${({theme, trailingShow}) =>
        !trailingShow &&
        css`
            padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
        `}

    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.small * 4)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
        };

        return contentSize[size];
    }}
`;

export const Leading = styled.View<LeadingProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.small * 6)}px;
                width: ${theme.adaptSize(theme.spacing.small * 6)}px;
            `,
            medium: css`
                height: ${theme.adaptSize(theme.spacing.small * 6)}px;
                width: ${theme.adaptSize(theme.spacing.small * 6)}px;
            `,
            large: css`
                height: ${theme.adaptSize(theme.spacing.small * 6)}px;
                width: ${theme.adaptSize(theme.spacing.small * 6)}px;
            `,
        };

        return contentSize[size];
    }}
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

export const Input = styled(TextInput)<InputProps>`
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
    `};

    ${({theme, size = 'medium', secureTextEntry}) => {
        const contentSize = {
            small: css`
                font-size: ${theme.adaptFontSize(theme.typography.body.medium.size)}px;
                font-style: ${theme.typography.body.medium.style};
                font-weight: ${theme.typography.body.medium.weight};
                letter-spacing: ${theme.adaptSize(theme.typography.body.medium.letterSpacing)}px;
                padding: ${theme.spacing.none}px;
            `,
            medium: css`
                font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
                font-style: ${theme.typography.body.large.style};
                font-weight: ${theme.typography.body.large.weight};
                letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
                padding: ${theme.spacing.none}px;
            `,
            large: css`
                font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
                font-style: ${theme.typography.body.large.style};
                font-weight: ${theme.typography.body.large.weight};
                letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
                padding: ${theme.spacing.none}px;
            `,
        };

        /**
         * Using secureTextEntry props in macOS with text-related styles on the input box will cause the
         * enableFocusRing setting to be invalidated. It is uncertain whether this is a bug in
         * react-native-macos or a native bug. As a temporary workaround, if you use secureTextEntry
         * in macos, it does not provide text styles.
         */
        return !secureTextEntry && contentSize[size];
    }}
`;

export const Trailing = styled(Leading)``;
export const SearchList = styled(Shape)<SearchListProps>`
    overflow: hidden;

    ${({type}) =>
        type === 'modal' &&
        css`
            position: absolute;
        `}

    ${({renderStyle = {}}) => {
        const {width = 0} = renderStyle;

        return css`
            width: ${width}px;
        `;
    }}

    ${({containerPageX = 0, containerPageY = 0, containerHeight = 0, type}) =>
        type === 'modal' &&
        css`
            left: ${containerPageY}px;
            top: ${containerPageX + containerHeight}px;
        `};

    ${({visible, type}) =>
        !visible &&
        type === 'modal' &&
        css`
            pointer-events: none;
        `};
`;
