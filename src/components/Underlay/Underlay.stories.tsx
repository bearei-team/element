import {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Pressable} from 'react-native';
import {EventName} from '../Common/interface';
import {Underlay, UnderlayProps} from './Underlay';

const HoverComponent = (props: UnderlayProps) => {
    const [eventName, setState] = useState<EventName>('none');

    return (
        <Pressable
            style={{height: 80, width: 200, backgroundColor: '#ececf0'}}
            onHoverIn={() => setState('hoverIn')}
            onHoverOut={() => setState('hoverOut')}
            onPressIn={() => setState('pressIn')}
            onPressOut={() => setState('pressOut')}>
            <Underlay {...props} eventName={eventName} />
        </Pressable>
    );
};

export default {
    title: 'components/Underlay',
    argTypes: {onPress: {action: 'pressed'}},
    component: HoverComponent,
} as Meta<typeof Underlay>;

export const Hover: StoryObj<UnderlayProps> = {
    args: {
        underlayColor: '#000011',
    },
};
