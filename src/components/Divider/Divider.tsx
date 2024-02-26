import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Layout, Size} from '../Common/interface';
import {Container, Content, Subheader} from './Divider.styles';
import {DividerBase, RenderProps} from './DividerBase';

export interface DividerProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: Layout;
    size?: Size;
    subheader?: string;
    renderStyle?: {width?: number; height?: number};
}

const render = ({id, subheader, renderStyle, style, ...containerProps}: RenderProps) => (
    <Container {...containerProps} testID={`divider--${id}`} renderStyle={renderStyle}>
        <Content style={style} testID={`divider__content--${id}`} />

        {subheader && (
            <Subheader size="small" testID={`divider__subheader--${id}`} type="title">
                {subheader}
            </Subheader>
        )}
    </Container>
);

const ForwardRefDivider = forwardRef<View, DividerProps>((props, ref) => (
    <DividerBase {...props} ref={ref} render={render} />
));

export const Divider: FC<DividerProps> = memo(ForwardRefDivider);
