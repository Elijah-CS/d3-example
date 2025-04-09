import {useState, FC, useRef, useEffect} from "react";
import "./App.css";
import styled from "styled-components";
import { CssBaseline } from "@mui/material";
import {ForceGraph} from "./graphs/ForceGraph";
import data1 from "./data/data1.json"

import ForceGraph3D, { ForceGraphMethods, LinkObject, NodeObject } from 'react-force-graph-3d';

import * as d3 from "d3";

const Main = styled("main")`
    display: flex;
    height: 100vh;
    flex-direction: column;
    background: #1b2a38;
    justify-content: center;
    align-items: center;
`

const App: FC = () => {
    const [xFactor, setXFactor] = useState<number>(0);
    const [yFactor, setYFactor] = useState<number>(0);

    const [index, setIndex] = useState<number>(0);

    const data = [data1];

    const ref = useRef<ForceGraphMethods<any, any>>(null);

    useEffect(() => {
        ref.current?.d3Force("x", d3.forceX().strength(xFactor))
        ref.current?.d3Force("y", d3.forceY().strength(yFactor))
        return () => {
            ref.current?.d3ReheatSimulation()
        }
    }, [xFactor, yFactor])

    return (
        <Main>
            <CssBaseline />
            <label style={{color: "white"}} htmlFor="adjustment-factor-x">Adjustment Factor X ({xFactor})</label>
            <input id="adjustment-factor-x" name="adjustment-factor-x" type="range" min="0" max="0.01" value = {`${xFactor}`} step="0.001" onChange={(event) => setXFactor(parseFloat(event.target.value))} />

            <label style={{color: "white"}} htmlFor="adjustment-factor-y">Adjustment Factor Y ({yFactor})</label>
            <input id="adjustment-factor-y" name="adjustment-factor-y" type="range" min="0" max="0.01" value = {`${yFactor}`} step="0.001" onChange={(event) => setYFactor(parseFloat(event.target.value))} />
            <div>
                <button onClick={() => setIndex((prev) => (prev - 1) - (data.length * Math.floor((prev - 1) / data.length)))}>back</button>
                <button onClick={() => setIndex((prev) => (prev + 1) % data.length)}>next</button>
                <span style={{color: "white"}}>{index}</span>
            </div>
            <ForceGraph3D
                width={1200}
                height={600}
                nodeVal={(d) => d.value ? d.value : 100} 
                graphData={data1} 
                nodeLabel={node => node.id ? node.id : ""} 
                nodeAutoColorBy="id" 
                linkDirectionalParticles={1}
                ref={ref as any}

            />
        </Main>
    )
}

export default App;