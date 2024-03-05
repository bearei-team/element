import React, {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Sheet} from './Sheet/Sheet';
import {Container} from './SideSheet.styles';
import {RenderProps, SideSheetBase, SideSheetProps} from './SideSheetBase';

const render = ({id, visible, ...sheetProps}: RenderProps) => (
    <Container key={`sideSheet__modal--${id}`} testID={`sideSheet__modal--${id}`}>
        {typeof visible === 'boolean' && <Sheet {...sheetProps} visible={visible} id={id} />}
    </Container>
);

const ForwardRefSideSheet = forwardRef<View, SideSheetProps>((props, ref) => (
    <SideSheetBase {...props} ref={ref} render={render} />
));

export const SideSheet: FC<SideSheetProps> = memo(ForwardRefSideSheet);
export type {SideSheetProps};
