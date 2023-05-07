import { createContext } from "react";

// create a context with default values
const controlContext = createContext({
	currMode: "",
	changeCurrMode: () => {},
	currBorderColor: "",
	changeCurrBorderColor: () => {},
	currBorderWidth: 1,
	changeCurrBorderWidth: () => {},
	changedCurrBorderWidth: () => {},
	currFillColor: "",
	changeCurrFillColor: () => {},

	shapes: [],
	shapesMap: {},
	addShape: () => {},
	moveShape: () => {},
	movedShape: () => {},
	selectedShapeId: "", // a string or undefined
	selectShape: () => {},
	deleteSelectedShape: () => {},

	undo: () => {},
	redo: () => {},
});

export default controlContext;
