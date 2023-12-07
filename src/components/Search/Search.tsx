import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Container, Content, Header, Leading, List, Trailing} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SourceMenu {
    key?: string;
    labelText?: string;
}

export interface SearchProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: 'horizontal' | 'vertical';
    menus?: SourceMenu[];
    onChange?: (key: string) => void;
    leading?: React.JSX.Element;
    trailing?: React.JSX.Element;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefSearch = forwardRef<View, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, renderStyle, leading, trailing, ...containerProps} = renderProps;
        const {height} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                ref={ref}
                style={{height}}
                testID={`search--${id}`}
                shape="full">
                <Header>
                    {leading && <Leading>{leading}</Leading>}
                    <Content></Content>
                    {trailing && <Trailing>{trailing}</Trailing>}
                </Header>
                <Divider />
                <List>{children}</List>
            </AnimatedContainer>
        );
    };

    return <SearchBase {...props} render={render} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
