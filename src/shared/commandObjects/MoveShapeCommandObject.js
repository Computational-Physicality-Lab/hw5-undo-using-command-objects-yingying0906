import CommandObject from "./CommandObject";

export default class MoveShapeCommandObject extends CommandObject {
	constructor(undoHandler) {
		super(undoHandler, true);
	}

	getName() {
		return "Move " + this.targetObject.type;
	}

	getColor() {
		return;
	}

	canExecute(selectedObj) {
		return selectedObj !== null;
	}

	execute(state, newData, prevData) {
		const selectedObj = state.shapesMap[state.selectedShapeId];

		if (selectedObj !== null) {
			this.targetObject = selectedObj;

			// record coordinate
			this.newValue = newData;
			this.oldValue = { ...prevData };

			// update object coordinate
			this.targetObject.initCoords = this.newValue.initCoords;
			this.targetObject.finalCoords = this.newValue.finalCoords;

			if (this.addToUndoStack) this.undoHandler.registerExecution(this);
		}
	}

	undo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update coordinate
		this.targetObject.initCoords = this.oldValue.initCoords;
		this.targetObject.finalCoords = this.oldValue.finalCoords;

		// change state of shapes map
		state.shapesMap[targetId].initCoords = this.oldValue.initCoords;
		state.shapesMap[targetId].finalCoords = this.oldValue.finalCoords;
	}

	redo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update coordinate
		this.targetObject.initCoords = this.newValue.initCoords;
		this.targetObject.finalCoords = this.newValue.finalCoords;

		// change state of shapes map
		state.shapesMap[targetId].initCoords = this.newValue.initCoords;
		state.shapesMap[targetId].finalCoords = this.newValue.finalCoords;
	}
}
