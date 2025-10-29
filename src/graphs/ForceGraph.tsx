import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {schemeTableau10} from "d3";
import {Data, Node, Link} from "../data"

type ForceGraphProps = {
    datasets: Data[];
    width: number;
    height: number;
    xFactor: number;
    yFactor: number;
    index: number;
}

function intern(value: any) {
    return value !== null && typeof value == "object" ? value.valueOf() : value;
}

export const ForceGraph = ({datasets, width, height, xFactor, yFactor, index}: ForceGraphProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [previousNodes, setPreviousNodes] = useState<Node[]>([]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic; border: 1px solid white;")

    const simulation: d3.Simulation<Node, undefined> = d3.forceSimulation([] as Node[])
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().id(d => (d as Node).id).distance(200))
        .force("x", d3.forceX().strength(xFactor))
        .force("y", d3.forceY().strength((yFactor * width) / height)
        .on("tick", ticked)
        .on("end", () => {
            simulation.alphaTarget(0.5).restart()
        });


    let link: d3.Selection<d3.BaseType | SVGLineElement, Link, SVGGElement, undefined> = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .attr("stroke-linecap", "round")
        .selectAll("line")

    let node: d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGGElement, undefined> = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1.5)
        .selectAll("circle")

    function ticked() {
        node
          .attr("cx", (d) => d.x !== undefined ? d.x : null)
          .attr("cy", (d) => d.y !== undefined ? d.y : null)
        
        link
          .attr("x1", (d) => typeof d.source !== "string" && d.source.x !== undefined ? d.source.x : null)
          .attr("y1", (d) => typeof d.source !== "string" && d.source.y !== undefined ? d.source.y : null)
          .attr("x2", (d) => typeof d.target !== "string" && d.target.x !== undefined ? d.target.x : null)
          .attr("y2", (d) => typeof d.target !== "string" && d.target.y !== undefined ? d.target.y : null)
    }

    function drag(simulation: d3.Simulation<Node, undefined>) {
        function dragstarted(event: d3.D3DragEvent<HTMLCanvasElement, Node, Node>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: d3.D3DragEvent<HTMLCanvasElement, Node, Node>) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<HTMLCanvasElement, Node, Node>) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    }

    function update(data: Data) {

        const old = new Map(previousNodes.map(d => [d.id, d]));

        const values: {[key: string]: number} = {};
        data.nodes.forEach(d => values[d.id] = 0);

        data.links.forEach((link) => {
            if (typeof link.source == "string") {
                values[link.source] += link.value.valueOf();
            } else {
                values[link.source.id] += link.value.valueOf();
            }

            if (typeof link.target == "string") {
                values[link.target] += link.value.valueOf();
            } else {
                values[link.target.id] += link.value.valueOf();
            }
        })

        let nodes  = data.nodes.map(d => {
            if (old.has(d.id)) {
                return old.get(d.id) as Node
            } else {
                return d
            }
        });

        let links = data.links.map(d => Object.assign({}, d))

        simulation.nodes(nodes)
        simulation.force("link", d3.forceLink(links).id((a, i, _b) => (a as Node).id))
        simulation.alpha(1).restart();

        node = node
            .data(nodes, d => d.id)
            .join(enter => enter.append("circle")
                .attr("r", (n) => Math.max(Math.log2(values[n.id]) * 3, 3))
                .attr("fill", "currentColor"))
            .call(drag(simulation) as any)
            .call(node => node.append("title").text(d => `${(d as Node).id}`));

        const G: string[] = d3.map(nodes, (d) => d.group).map(intern)
        const nodeGroups = d3.sort(G)
        const color = d3.scaleOrdinal(nodeGroups, schemeTableau10);

        if (G) {
            node.attr("fill", (_nodes, i, _data) => color(G[i]));
        }

        link = link
            .data(links)
            .join("line")
    }

    useEffect(() => {

        update(datasets[index])

        const graph = svg.node()

        if (ref.current && graph) {
            ref.current.appendChild(graph)
        }

        return () => {
            setPreviousNodes(node.data())

            simulation.stop();
            d3.select("svg").remove()
        }
    }, [index, xFactor, yFactor])

    return (
        <div ref={ref} />
    )

}

