import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Container, Content, Header, LeadingIcon, List, TrailingIcon} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SourceMenu {
    key?: string;
    labelText?: string;
}

export interface SearchProps extends Partial<ViewProps & RefAttributes<View>> {
    leadingIcon?: React.JSX.Element;
    menus?: SourceMenu[];
    onChange?: (key: string) => void;
    trailingIcon?: React.JSX.Element;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefSearch = forwardRef<View, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, renderStyle, leadingIcon, trailingIcon, ...containerProps} =
            renderProps;

        const {height} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                ref={ref}
                shape="full"
                style={{height}}
                testID={`search--${id}`}>
                <Header>
                    {leadingIcon && (
                        <LeadingIcon testID={`search__leadingIcon--${id}`}>
                            {leadingIcon}
                        </LeadingIcon>
                    )}

                    <Content testID={`search__content--${id}`}></Content>
                    {trailingIcon && (
                        <TrailingIcon testID={`search__trailingIcon--${id}`}>
                            {trailingIcon}
                        </TrailingIcon>
                    )}
                </Header>
                <Divider />
                <List>{children}</List>
            </AnimatedContainer>
        );
    };

    return <SearchBase {...props} render={render} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
