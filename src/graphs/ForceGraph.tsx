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
    return (
        <div>Text</div>
    )
}
