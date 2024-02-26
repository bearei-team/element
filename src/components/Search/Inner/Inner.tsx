import {FC, forwardRef, memo} from 'react';
import {Animated, TextInput} from 'react-native';
import {Divider} from '../../Divider/Divider';
import {Hovered} from '../../Hovered/Hovered';
import {Icon} from '../../Icon/Icon';
import {List} from '../../List/List';
import {Container, Content, Header, Leading, Trailing} from './Inner.styles';
import {InnerBase, InnerProps, RenderProps} from './InnerBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({
    activeKey,
    containerLayout,
    data,
    eventName,
    id,
    input,
    leading,
    listVisible,
    onActive,
    onEvent,
    placeholder,
    renderStyle,
    trailing,
    underlayColor,
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
            renderStyle={{width: containerWidth}}
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
                    shape={listVisible ? 'extraLargeTop' : shape}
                    underlayColor={underlayColor}
                />
            </Header>
            <Divider />
            <List data={data} activeKey={activeKey} onActive={onActive} />
        </AnimatedContainer>
    );
};

const ForwardRefInner = forwardRef<TextInput, InnerProps>((props, ref) => (
    <InnerBase {...props} ref={ref} render={render} />
));

export const Inner: FC<InnerProps> = memo(ForwardRefInner);
export type {InnerProps};
