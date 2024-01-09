import {Meta, StoryObj} from '@storybook/react';
import {FAB} from '../FAB/FAB';
import {NavigationRail, NavigationRailProps} from './NavigationRail';

export default {
    title: 'components/NavigationRail',
    component: NavigationRail,
} as Meta<typeof NavigationRail>;

export const Rail: StoryObj<NavigationRailProps> = {
    args: {
        defaultActiveKey: 'name',
        fab: <FAB defaultElevation={0} />,
        data: [
            {
                labelText: 'Label1',
                key: 'name',
            },
            {
                labelText: 'Label2',
                key: 'age',
            },
            {
                labelText: 'Label3',
                key: 'sex',
            },
        ],
    },
};
