import {forwardRef, useEffect, useId} from 'react';
import {LayoutRectangle, NativeTouchEvent, View, ViewProps, ViewStyle} from 'react-native';
import {AnimatedStyle} from 'react-native-reanimated';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../../Common/interface';
import {ExitAnimated} from '../TouchableRippleBase';
import {useAnimated} from './useAnimated';

export interface RippleProps extends Partial<ViewProps & React.RefAttributes<View>> {
    active?: boolean;
    centered?: boolean;
    onEntryAnimatedFinished?: (sequence: string, exitAnimated: ExitAnimated) => void;
    sequence: string;
    touchableLayout?: LayoutRectangle;
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    underlayColor?: string;
    containerCurrent?: View | null;
}

export interface RenderProps extends Omit<RippleProps, 'sequence'> {
    locationX: number;
    locationY: number;
    renderStyle: AnimatedStyle<ViewStyle> & {
        height: number;
        width: number;
        animatedStyle: AnimatedStyle<ViewStyle>;
    };
}

interface RippleBaseProps extends RippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    containerLayout?: LayoutRectangle & {pageX: number; pageY: number};
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

const processContainerLayout = ({setState}: ProcessEventOptions, containerCurrent?: View | null) =>
    containerCurrent?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            const update =
                draft?.containerLayout?.pageX !== pageX || draft?.containerLayout?.pageY !== pageY;

            if (update) {
                draft.containerLayout = {
                    height,
                    pageX,
                    pageY,
                    width,
                    x,
                    y,
                };

                draft.status === 'idle' && (draft.status = 'succeeded');
            }
        }),
    );

export const RippleBase = forwardRef<View, RippleBaseProps>(
    (
        {
            active,
            centered,
            containerCurrent,
            onEntryAnimatedFinished,
            render,
            sequence,
            touchableLayout,
            touchableLocation = {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
            underlayColor,
            ...renderProps
        },
        ref,
    ) => {
        const [{containerLayout, status}, setState] = useImmer<InitialState>({
            containerLayout: undefined,
            status: 'idle',
        });

        const id = useId();
        const {width = 0, height = 0} = touchableLayout ?? containerLayout ?? {};
        const centerX = width / 2;
        const centerY = height / 2;
        const {locationX = 0, locationY = 0} = centered
            ? {locationX: centerX, locationY: centerY}
            : touchableLocation;

        const offsetX = Math.abs(centerX - locationX);
        const offsetY = Math.abs(centerY - locationY);
        const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
        const diameter = radius * 2;
        const [animatedStyle] = useAnimated({active, onEntryAnimatedFinished, sequence, radius});

        useEffect(() => {
            processContainerLayout({setState}, containerCurrent);
        }, [containerCurrent, setState]);

        if (status === 'idle') {
            return <></>;
        }

        return render({
            ...renderProps,
            active,
            id,
            ref,
            renderStyle: {
                animatedStyle,
                height: diameter,
                width: diameter,
            },
            locationX,
            locationY,
            underlayColor,
        });
    },
);
