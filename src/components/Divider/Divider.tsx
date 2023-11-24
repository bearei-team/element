import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Layout, Size} from '../Common/interface';
import {Container, Main, Subheader} from './Divider.styles';
import {DividerBase, RenderProps} from './DividerBase';

export interface DividerProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: Layout;
    size?: Size;
    subheader?: string;
}

const ForwardRefDivider = forwardRef<View, DividerProps>((props, ref) => {
    const render = ({id, subheader, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`divider--${id}`}>
            <Main testID={`divider__main--${id}`} />

            {subheader && <Subheader testID={`divider__subheader--${id}`}>{subheader}</Subheader>}
        </Container>
    );

    return <DividerBase {...props} render={render} />;
});

export const Divider: FC<DividerProps> = memo(ForwardRefDivider);
