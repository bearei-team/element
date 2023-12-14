import {FC, useId} from 'react';
import {SheetProps} from './Sheet';

export type RenderProps = SheetProps;
export interface SheetBaseProps extends SheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const SheetBase: FC<SheetBaseProps> = props => {
    const {headlineText = 'Title', render, ...renderProps} = props;
    const id = useId();

    return render({
        ...renderProps,
        headlineText,
        id,
    });
};
