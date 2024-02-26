import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './BadgeBase';

type ContainerProps = Pick<RenderProps, 'size' | 'renderStyle'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: absolute;

    ${({theme}) => css`
        background-color: ${theme.palette.error.error};
    `}

    ${({theme, size = 'medium'}) => {
        const containerSize = {
            large: css`
                height: ${theme.adaptSize(theme.spacing.medium)}px;
                min-width: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            medium: css`
                height: ${theme.adaptSize(theme.spacing.medium)}px;
                min-width: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            small: css`
                height: ${theme.adaptSize(theme.spacing.small - 2)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
                width: ${theme.adaptSize(theme.spacing.small - 2)}px;
            `,
        };

        return containerSize[size];
    }}

    ${({renderStyle = {}, theme}) => {
        const {bottom, left, right, top} = renderStyle;

        return css`
            bottom: ${typeof bottom === 'number' ? `${theme.adaptSize(bottom)}px` : 'auto'};
            left: ${typeof left === 'number' ? `${theme.adaptSize(left)}px` : 'auto'};
            right: ${typeof right === 'number' ? `${theme.adaptSize(right)}px` : 'auto'};
            top: ${typeof top === 'number' ? `${theme.adaptSize(top)}px` : 'auto'};
        `;
    }}
`;

export const LabelText = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.error.onError};
    `}
`;
