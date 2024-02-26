import {FC, forwardRef, memo} from 'react';
import {Animated, LayoutRectangle, ScaledSize, TextInput, View} from 'react-native';
import {EventName} from '../../Common/interface';
import {Divider} from '../../Divider/Divider';
import {Hovered} from '../../Hovered/Hovered';
import {Icon} from '../../Icon/Icon';
import {List} from '../../List/List';
import {SearchProps} from '../Search';
import {Container, Content, Header, Leading, Trailing} from './Inner.styles';
import {InnerBase, RenderProps} from './InnerBase';

export interface InnerProps extends SearchProps {
    activeKey?: string;
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    eventName: EventName;
    onListActive: (key?: string) => void;
    underlayColor: string;
    containerCurrent: View | null;
    windowDimensions: ScaledSize;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({
    containerLayout,
    eventName,
    id,
    input,
    leading,
    onEvent,
    placeholder,
    trailing,
    underlayColor,
    visible,
    renderStyle,
    activeKey,
    data,
    ...containerProps
}: RenderProps) => {
    const shape = 'extraLarge';
    const {onBlur, onFocus, ...headerEvent} = onEvent;
    const {height} = renderStyle;
    const {height: containerHeight, pageX, pageY, width: containerWidth} = containerLayout;
    const iconRenderStyle = {width: 24, height: 24};

    return (
        <AnimatedContainer
            {...containerProps}
            pageX={pageX}
            pageY={pageY}
            shape={shape}
            style={{height}}
            testID={`search__inner--${id}`}>
            <Header
                {...headerEvent}
                accessibilityLabel={placeholder}
                accessibilityRole="keyboardkey"
                onBlur={onBlur}
                onFocus={onFocus}
                testID={`search__header--${id}`}>
                <Leading testID={`search__leading--${id}`}>
                    {leading ?? (
                        <Icon type="outlined" name="search" renderStyle={iconRenderStyle} />
                    )}
                </Leading>

                <Content testID={`search__content--${id}`}>{input}</Content>
                <Trailing testID={`search__trailing--${id}`}>{trailing}</Trailing>
                <Hovered
                    eventName={eventName}
                    opacities={[0, 0.08]}
                    renderStyle={{width: containerWidth, height: containerHeight}}
                    shape={visible ? 'extraLargeTop' : shape}
                    underlayColor={underlayColor}
                />
            </Header>

            <Divider />
            <List data={data} activeKey={activeKey} />
        </AnimatedContainer>
    );
};

const ForwardRefInner = forwardRef<TextInput, InnerProps>((props, ref) => (
    <InnerBase {...props} ref={ref} render={render} />
));

export const Inner: FC<InnerProps> = memo(ForwardRefInner);
