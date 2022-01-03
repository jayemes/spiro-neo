import Rete from "rete";

const numSocket = new Rete.Socket("Number value");
const vectorSocket = new Rete.Socket("Vector value");
const styleSocket = new Rete.Socket("Style value");
const tranformSocket = new Rete.Socket("Transform value");
const colorSocket = new Rete.Socket("Color value");

export { numSocket, vectorSocket, styleSocket, tranformSocket, colorSocket };
