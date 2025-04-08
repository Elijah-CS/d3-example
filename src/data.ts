export interface Node extends d3.SimulationNodeDatum {
    id: string;
    group?: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node | string;
    target: Node | string;
    value: number;
}

export type Data = {
    nodes: Node[];
    links: Link[];
}