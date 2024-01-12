import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Layout, Size} from '../Common/interface';
import {Container, Content, Subheader} from './Divider.styles';
import {DividerBase, RenderProps} from './DividerBase';

export interface DividerProps extends Partial<ViewProps & RefAttributes<View>> {
    height?: number;
    layout?: Layout;
    size?: Size;
    subheader?: string;
    width?: number;
}

const ForwardRefDivider = forwardRef<View, DividerProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, subheader, width, height, style, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} height={height} testID={`divider--${id}`} width={width}>
                <Content style={style} testID={`divider__content--${id}`} />

                {subheader && (
                    <Subheader size="small" testID={`divider__subheader--${id}`} type="title">
                        {subheader}
                    </Subheader>
                )}
            </Container>
        );
    };

    return <DividerBase {...props} ref={ref} render={render} />;
});

export const Divider: FC<DividerProps> = memo(ForwardRefDivider);
