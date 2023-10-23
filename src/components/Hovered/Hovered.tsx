import {ViewProps} from 'react-native';
import {BaseHovered, RenderProps} from './BaseHovered';
import {Container} from './Hovered.styles';
import {FC, memo} from 'react';
import {State} from '../../common/interface';

export interface HoveredProps extends ViewProps {
    width?: number;
    height?: number;
    underlayColor?: string;
    opacity?: number;
    state?: State;
    disabled: boolean;
}

export const Hovered: FC<HoveredProps> = memo((props): React.JSX.Element => {
    const render = ({id, ...args}: RenderProps): React.JSX.Element => (
        <>{args.width !== 0 && <Container {...args} testID={`hovered--${id}`} />}</>
    );

    return <BaseHovered {...props} render={render} />;
});
