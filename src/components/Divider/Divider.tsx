import {FC, memo} from 'react';
import {ViewProps} from 'react-native';
import {Container, Main} from './Divider.styles';
import {BaseDivider, RenderProps} from './BaseDivider';
import {Layout, Size} from '../common/interface';

export interface DividerProps extends ViewProps {
    subHeader?: string;
    layout?: Layout;
    size?: Size;
}

export const Divider: FC<DividerProps> = memo(props => {
    const render = ({id, ...containerProps}: RenderProps) => {
        return (
            <Container {...containerProps} testID={`divider--${id}`}>
                <Main testID={`divider__main--${id}`} />
            </Container>
        );
    };

    return <BaseDivider {...props} render={render} />;
});
