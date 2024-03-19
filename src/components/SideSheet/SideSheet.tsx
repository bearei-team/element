import React, {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Sheet} from './Sheet/Sheet';
import {Container} from './SideSheet.styles';
import {RenderProps, SideSheetBase, SideSheetProps} from './SideSheetBase';

const render = ({id, visible, type, ...sheetProps}: RenderProps) => {
    const sheet = <Sheet {...sheetProps} visible={visible} type={type} />;

    return (
        <>
            {type === 'standard' ? (
                sheet
            ) : (
                <Container testID={`sideSheet__modal--${id}`}>{sheet}</Container>
            )}
        </>
    );
};

const ForwardRefSideSheet = forwardRef<View, SideSheetProps>((props, ref) => (
    <SideSheetBase {...props} ref={ref} render={render} />
));

export const SideSheet: FC<SideSheetProps> = memo(ForwardRefSideSheet);
export type {SideSheetProps};
