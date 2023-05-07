import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";

import ControlContext from "./contexts/control-context";
import { genId, defaultValues } from "./shared/util";

import "./App.css";

import CommandList from "./containers/CommandList/CommandList";
import AddShapeCommandObject from "./shared/commandObjects/AddShapeCommandObject";
import DeleteShapeCommandObject from "./shared/commandObjects/DeleteShapeCommandObject";
import MoveShapeCommandObject from "./shared/commandObjects/MoveShapeCommandObject";
import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";

class App extends Component {
	state = {
		// controls
		currMode: defaultValues.mode,
		currBorderColor: defaultValues.borderColor,
		currBorderWidth: defaultValues.borderWidth,
		currFillColor: defaultValues.fillColor,

		isSliding: false,
		prevBorderWidth: defaultValues.borderWidth,
		finalBorderWidth: defaultValues.borderWidth,
		prevCoordinate: null,
		finalCoordinate: null,

		// workspace
		shapes: [],
		shapesMap: {},
		selectedShapeId: undefined,

		// handling undo/redo
		commandList: [],
		currCommand: -1,
	};

	constructor() {
		super();

		/*
		 * pass this undoHandler into command object constructors:
		 *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
		 */
		this.undoHandler = {
			registerExecution: this.registerExecution,
			// TODO: fill this up with whatever you need for the command objects
		};
	}

	/*
	 * TODO:
	 * add the commandObj to the commandList so
	 * that is available for undoing.
	 */
	registerExecution = (commandObject) => {
		// new command object
		const { commandList, currCommand } = this.state;

		this.setState((prevState) => {
			// if new command object is not the last command object in the list
			let truncatedList;
			if (currCommand < commandList.length - 1) {
				truncatedList = prevState.commandList.slice(
					0,
					prevState.currCommand + 1
				);
			} else {
				truncatedList = prevState.commandList;
			}
			return {
				commandList: [...truncatedList, commandObject],
				currCommand: prevState.currCommand + 1,
			};
		});
	};

	/*
	 * TODO:
	 * actually call the undo method of the command at
	 * the current position in the undo stack
	 */
	undo = () => {
		const { commandList, currCommand } = this.state;

		if (currCommand >= 0) {
			const commandObject = commandList[currCommand];
			commandObject.undo(this.state);

			this.setState((prevState) => ({
				currCommand: prevState.currCommand - 1,
			}));

			// change to select mode
			this.changeCurrMode("select");
		}
	};

	/*
	 * TODO:
	 * actually call the redo method of the command at
	 * the current position in the undo stack. Note that this is
	 * NOT the same command as would be affected by a doUndo()
	 */
	redo = () => {
		const { commandList, currCommand } = this.state;

		if (currCommand < commandList.length - 1) {
			const commandObject = commandList[currCommand + 1];
			commandObject.redo(this.state);
			this.setState((prevState) => ({
				currCommand: prevState.currCommand + 1, //
			}));

			// change to select mode
			this.changeCurrMode("select");
		}
	};

	// add the shapeId to the array, and the shape itself to the map
	addShape = (shapeData) => {
		let shapes = [...this.state.shapes];
		let shapesMap = { ...this.state.shapesMap };
		const id = genId();
		shapesMap[id] = {
			...shapeData,
			id,
		};
		shapes.push(id);

		// command object
		this.setState({ shapes, shapesMap, selectedShapeId: id }, () => {
			// call back function to prevent error
			let cmdObj = new AddShapeCommandObject(this.undoHandler);
			cmdObj.execute(this.state, id);
		});
	};

	// get the shape by its id, and update its properties
	updateShape = (shapeId, newData) => {
		let shapesMap = { ...this.state.shapesMap };
		let targetShape = shapesMap[shapeId];
		shapesMap[shapeId] = { ...targetShape, ...newData };
		this.setState({ shapesMap });
	};

	movedShape = () => {
		// command object after moved
		if (this.state.selectedShapeId) {
			let cmdObj = new MoveShapeCommandObject(this.undoHandler);
			cmdObj.execute(
				this.state,
				this.finalCoordinate,
				this.prevCoordinate
			);
		}
		this.isSliding = false;
	};

	moveShape = (newData) => {
		const { shapesMap, selectedShapeId } = this.state;
		const target = shapesMap[selectedShapeId];
		// record the starting coordinate of the shape
		if (!this.isSliding) {
			let oldCoords = {
				initCoords: target.initCoords,
				finalCoords: target.finalCoords,
			};
			this.prevCoordinate = { ...oldCoords };
			this.isSliding = true;
		}

		if (selectedShapeId) {
			this.updateShape(selectedShapeId, newData);
			this.finalCoordinate = newData;
		}
	};

	// deleting a shape sets its visibility to false, rather than removing it
	deleteSelectedShape = () => {
		let shapesMap = { ...this.state.shapesMap };
		shapesMap[this.state.selectedShapeId].visible = false;
		this.setState({ shapesMap, selectedShapeId: undefined });

		// add command object
		let cmdObj = new DeleteShapeCommandObject(this.undoHandler);
		cmdObj.execute(this.state, this.state.selectedShapeId);
	};

	changeCurrMode = (mode) => {
		if (mode === "line") {
			this.setState({
				currMode: mode,
				currBorderColor: defaultValues.borderColor,
			});
		} else {
			this.setState({ currMode: mode });
		}
	};

	changeCurrBorderColor = (borderColor) => {
		const { selectedShapeId } = this.state;
		this.setState({ currBorderColor: borderColor });
		if (selectedShapeId) {
			this.updateShape(selectedShapeId, { borderColor });

			// add command object
			let cmdObj = new ChangeBorderColorCommandObject(this.undoHandler);
			cmdObj.execute(this.state, borderColor);
		}
	};

	changedCurrBorderWidth = () => {
		// command object after changed border width
		if (this.state.selectedShapeId) {
			let cmdObj = new ChangeBorderWidthCommandObject(this.undoHandler);
			cmdObj.execute(
				this.state,
				this.finalBorderWidth,
				this.prevBorderWidth
			);
		}
		this.isSliding = false;
	};
	changeCurrBorderWidth = (borderWidth) => {
		if (!this.isSliding) {
			this.currBorderWidth = this.state.currBorderWidth;
			this.prevBorderWidth = this.currBorderWidth;
			this.isSliding = true;
		}

		this.setState({ currBorderWidth: borderWidth });
		if (this.state.selectedShapeId) {
			this.updateShape(this.state.selectedShapeId, { borderWidth });
			this.finalBorderWidth = borderWidth;
		}
	};

	changeCurrFillColor = (fillColor) => {
		this.setState({ currFillColor: fillColor });

		const { selectedShapeId, shapesMap } = this.state;
		if (selectedShapeId && shapesMap[selectedShapeId].type !== "line") {
			this.updateShape(selectedShapeId, { fillColor });

			// add command object
			let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
			cmdObj.execute(this.state, fillColor);
		}
	};

	render() {
		const {
			currMode,
			currBorderColor,
			currBorderWidth,
			currFillColor,
			shapes,
			shapesMap,
			selectedShapeId,
		} = this.state;

		// update the context with the functions and values defined above and from state
		// and pass it to the structure below it (control panel and workspace)
		return (
			<React.Fragment>
				<ControlContext.Provider
					value={{
						currMode,
						changeCurrMode: this.changeCurrMode,
						currBorderColor,
						changeCurrBorderColor: this.changeCurrBorderColor,
						currBorderWidth,
						changeCurrBorderWidth: this.changeCurrBorderWidth,
						currFillColor,
						changedCurrBorderWidth: this.changedCurrBorderWidth,
						changeCurrFillColor: this.changeCurrFillColor,

						shapes,
						shapesMap,
						addShape: this.addShape,
						moveShape: this.moveShape,
						movedShape: this.movedShape,
						selectedShapeId,
						selectShape: (id) => {
							this.setState({ selectedShapeId: id });
							if (id) {
								const {
									borderColor,
									borderWidth,
									fillColor,
								} = shapesMap[
									shapes.filter(
										(shapeId) => shapeId === id
									)[0]
								];
								this.setState({
									currBorderColor: borderColor,
									currBorderWidth: borderWidth,
									currFillColor: fillColor,
								});
							}
						},
						deleteSelectedShape: this.deleteSelectedShape,

						undo: this.undo,
						redo: this.redo,
					}}
				>
					<ControlPanel
						commandList={this.state.commandList}
						currCommand={this.state.currCommand}
					/>
					<Workspace />
					<CommandList
						className="command-list"
						commandList={this.state.commandList}
						currCommand={this.state.currCommand}
					/>
				</ControlContext.Provider>
			</React.Fragment>
		);
	}
}

export default App;
