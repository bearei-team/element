import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Layout, Size} from '../Common/interface';
import {Container, Content, Subheader} from './Divider.styles';
import {DividerBase, RenderProps} from './DividerBase';

export interface DividerProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: Layout;
    size?: Size;
    subheader?: string;
}

const ForwardRefDivider = forwardRef<View, DividerProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, subheader, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`divider--${id}`}>
                <Content testID={`divider__content--${id}`} />

                {subheader && (
                    <Subheader testID={`divider__subheader--${id}`}>{subheader}</Subheader>
                )}
            </Container>
        );
    };

    return <DividerBase {...props} render={render} />;
});

export const Divider: FC<DividerProps> = memo(ForwardRefDivider);
