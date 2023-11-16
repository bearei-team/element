// import {TextInput} from 'react-native';
// import styled, {css} from 'styled-components/native';
// import {Shape} from '../Common/Common.styles';
// import {TextFieldProps} from './TextField';

// export type MainProps = Pick<TextFieldProps, 'type'> & {trailingIconShow: boolean};
// export interface LabelProps extends Omit<MainProps, 'trailingIconShow'> {}
// export type SupportingTextProps = Pick<TextFieldProps, 'error'>;

// export const Container = styled.Pressable`
//     display: flex;
//     flex-direction: column;

//     ${({theme}) => css`
//         gap: ${theme.spacing.extraSmall}px;
//     `}
// `;

// export const Main = styled(Shape)<MainProps>`
//     position: relative;
//     display: flex;
//     flex-direction: row;
//     align-items: center;

//     ${({theme}) =>
//         css`
//             padding-vertical: ${theme.spacing.extraSmall}px;
//         `}

//     ${({theme, trailingIconShow}) =>
//         trailingIconShow
//             ? css`
//                   padding-start: ${theme.spacing.medium}px;
//               `
//             : css`
//                   padding-horizontal: ${theme.spacing.medium}px;
//               `}

//     ${({theme, type = 'filled'}) => {
//         const themeType = {
//             filled: css`
//                 background-color: ${theme.palette.surface.surfaceContainerHighest};
//             `,

//             outlined: css`
//                 background-color: ${theme.palette.surface.onSurfaceVariant};
//             `,
//         };

//         return themeType[type];
//     }}
// `;

// export const Label = styled.Text<LabelProps>`
//     ${({theme}) => css`
//         font-style: ${theme.typography.label.small.style};
//         font-weight: ${theme.typography.label.small.weight};
//     `};
// `;

// export const Content = styled.View`
//     flex: 1;
//     height: 48px;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
// `;

// export const ActiveIndicator = styled.View`
//     position: absolute;
//     width: 100%;
//     left: 0;
//     bottom: 0;
// `;

// export const Input = styled(TextInput)`
//     ${({theme}) => css`
//         font-size: ${theme.typography.body.large.size}px;
//         font-style: ${theme.typography.body.large.style};
//         font-weight: ${theme.typography.body.large.weight};
//         line-height: ${theme.typography.body.large.lineHeight}px;
//         letter-spacing: ${theme.typography.body.large.letterSpacing}px;
//         color: ${theme.palette.surface.onSurface};
//     `}
// `;

// export const TrailingIcon = styled.View`
//     width: 48px;
//     height: 48px;
//     display: flex;
//     justify-content: center;
//     align-items: center;

//     ${({theme}) => css`
//         padding-vertical: ${theme.spacing.small}px;
//         padding-horizontal: ${theme.spacing.small}px;
//     `}
// `;

// export const SupportingText = styled.Text<SupportingTextProps>`
//     ${({theme}) => css`
//         font-size: ${theme.typography.body.small.size}px;
//         font-style: ${theme.typography.body.small.style};
//         font-weight: ${theme.typography.body.small.weight};
//         line-height: ${theme.typography.body.small.lineHeight}px;
//         letter-spacing: ${theme.typography.body.small.letterSpacing}px;
//         padding-horizontal: ${theme.spacing.medium}px;
//         color: ${theme.palette.surface.onSurfaceVariant};
//     `}

//     ${({theme, error}) =>
//         error &&
//         css`
//             color: ${theme.palette.error.error};
//         `}
// `;
