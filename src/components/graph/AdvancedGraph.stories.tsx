import type { Meta, StoryObj } from '@storybook/react';
import AdvancedGraph from './AdvancedGraph';
import { nodes, links } from '../../data/mock-graph-data';

const meta: Meta<typeof AdvancedGraph> = {
  title: 'Graph/AdvancedGraph',
  component: AdvancedGraph,
};

export default meta;

type Story = StoryObj<typeof AdvancedGraph>;

export const Default: Story = {
  args: {
    nodes,
    links,
  },
};