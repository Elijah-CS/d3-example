import {useState, FC} from "react";
import "./App.css";
import styled from "styled-components";
import { CssBaseline } from "@mui/material";
import {ForceGraph} from "./graphs/ForceGraph";
import data1 from "./data/data1.json"

const Main = styled("main")`
    display: flex;
    height: 100vh;
    flex-direction: column;
    background: #1b2a38;
    justify-content: center;
    align-items: center;
`

const App: FC = () => {
    const [xFactor, setXFactor] = useState<number>(0.05);
    const [yFactor, setYFactor] = useState<number>(0.1);

    const [index, setIndex] = useState<number>(0);

    const data = [data1];

    return (
        <Main>
            <CssBaseline />
            <label style={{color: "white"}} htmlFor="adjustment-factor-x">Adjustment Factor X ({xFactor})</label>
            <input id="adjustment-factor-x" name="adjustment-factor-x" type="range" min="0" max="1" value = {`${xFactor}`} step="0.001" onChange={(event) => setXFactor(parseFloat(event.target.value))} />

            <label style={{color: "white"}} htmlFor="adjustment-factor-y">Adjustment Factor Y ({yFactor})</label>
            <input id="adjustment-factor-y" name="adjustment-factor-y" type="range" min="0" max="0.3" value = {`${yFactor}`} step="0.001" onChange={(event) => setYFactor(parseFloat(event.target.value))} />
            <div>
                <button onClick={() => setIndex((prev) => (prev - 1) - (data.length * Math.floor((prev - 1) / data.length)))}>back</button>
                <button onClick={() => setIndex((prev) => (prev + 1) % data.length)}>next</button>
                <span style={{color: "white"}}>{index}</span>
            </div>
            <ForceGraph width={1600} height={800} datasets={data} xFactor={xFactor} yFactor={yFactor} index={index}/>
        </Main>
    )
}

export default App;