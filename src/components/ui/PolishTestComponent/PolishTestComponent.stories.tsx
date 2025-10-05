// PolishTestComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { PolishTestComponent } from "./PolishTestComponent";

const meta: Meta<typeof PolishTestComponent> = {
	title: "Components/PolishTestComponent",
	component: PolishTestComponent,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A test component for Polish character support verification",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithCustomClass: Story = {
	args: {
		className: "custom-styling",
	},
};

export const PolishVersion: Story = {
	parameters: {
		docs: {
			description: {
				story: "Component with Polish localization enabled.",
			},
		},
	},
};
