import CommandObject from "./CommandObject";

export default class ChangeBorderColorCommandObject extends CommandObject {
	constructor(undoHandler) {
		super(undoHandler, true);
	}

	getName() {
		return "Change " + this.targetObject.type + " border Color to ";
	}
	getColor() {
		if (this.newValue) {
			return this.newValue;
		} else {
			return "Unknown Color";
		}
	}

	canExecute(selectedObj) {
		return selectedObj !== null;
	}

	execute(state, borderColor) {
		const selectedObj = state.shapesMap[state.selectedShapeId];

		if (selectedObj !== null) {
			this.targetObject = selectedObj;
			this.oldValue = selectedObj.borderColor;
			this.newValue = borderColor;
			this.targetObject.borderColor = this.newValue;

			if (this.addToUndoStack) this.undoHandler.registerExecution(this);
		}
	}

	undo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update local object color
		this.targetObject.borderColor = this.oldValue;

		// change state of shapes map
		state.shapesMap[targetId].borderColor = this.oldValue;

		// the palette
		state.currBorderColor = this.oldValue;
	}

	redo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update local object color
		this.targetObject.borderColor = this.newValue;

		// change state of shapes map
		state.shapesMap[targetId].borderColor = this.newValue;

		// the palette
		state.currBorderColor = this.newValue;
	}
}
