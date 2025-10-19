export interface Node {
	id: string;
	label: string;
}

export interface Link {
	source: string;
	target: string;
}

export const nodes: Node[] = [
	{ id: "A", label: "Node A" },
	{ id: "B", label: "Node B" },
	{ id: "C", label: "Node C" },
	{ id: "D", label: "Node D" },
];

export const links: Link[] = [
	{ source: "A", target: "B" },
	{ source: "B", target: "C" },
	{ source: "C", target: "D" },
	{ source: "D", target: "A" },
];
