import CommandObject from "./CommandObject";

export default class ChangeBorderWidthCommandObject extends CommandObject {
	constructor(undoHandler) {
		super(undoHandler, true);
	}

	getName() {
		return "Change " + this.targetObject.type + " border Width to ";
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

	execute(state, borderWidth, prevBorderWidth) {
		const selectedObj = state.shapesMap[state.selectedShapeId];

		if (selectedObj !== null) {
			this.targetObject = selectedObj;
			this.oldValue = prevBorderWidth;
			this.newValue = borderWidth;
			this.targetObject.borderWidth = this.newValue;

			if (this.addToUndoStack) this.undoHandler.registerExecution(this);
		}
	}

	undo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update object width
		this.targetObject.borderWidth = this.oldValue;

		// change state of shapes map
		state.shapesMap[targetId].borderWidth = this.oldValue;

		// palette
		state.currBorderWidth = this.oldValue;
	}

	redo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update object width
		this.targetObject.borderWidth = this.newValue;

		// change state of shapes map
		state.shapesMap[targetId].borderWidth = this.newValue;

		// palette
		state.currBorderWidth = this.newValue;
	}
}
