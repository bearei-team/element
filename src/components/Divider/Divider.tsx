import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Layout, Size} from '../Common/interface';
import {BaseDivider, RenderProps} from './BaseDivider';
import {Container, Main, Subheader} from './Divider.styles';

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

    return <BaseDivider {...props} render={render} />;
});

export const Divider: FC<DividerProps> = memo(ForwardRefDivider);
