import styled, {css} from 'styled-components/native';
import {Shape, ShapeProps} from '../Common/Common.styles';
import {RenderProps} from './NavigationBarBase';

type ContainerProps = Pick<RenderProps, 'block'> &
    ShapeProps & {
        renderStyle: {width?: number};
    };

type DestinationProps = Pick<ContainerProps, 'renderStyle' | 'block'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surfaceContainer};
    `}

    ${({block, renderStyle}) => {
        const {width = 0} = renderStyle;

        return block
            ? css`
                  width: 100%;
              `
            : css`
                  width: ${width}px;
              `;
    }}
`;

export const Destination = styled.View<DestinationProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
        padding: ${theme.spacing.none}px ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({block, renderStyle}) => {
        const {width = 0} = renderStyle;

        return (
            block &&
            css`
                width: ${width}px;
            `
        );
    }}
`;
