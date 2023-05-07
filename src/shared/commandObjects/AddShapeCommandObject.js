import CommandObject from "./CommandObject";

export default class AddShapeCommandObject extends CommandObject {
	constructor(undoHandler) {
		super(undoHandler, true);
	}

	getName() {
		return "Create " + this.targetObject.type;
	}
	getColor() {
		return;
	}

	canExecute(selectedObj) {
		return selectedObj !== null;
	}

	execute(state, id) {
		const selectedObj = state.shapesMap[id];

		if (selectedObj !== null) {
			this.targetObject = selectedObj;
			if (this.addToUndoStack) this.undoHandler.registerExecution(this);
		}
	}

	undo(state) {
		const targetId = this.targetObject.id;
		state.selectedShapeId = null;
		state.shapesMap[targetId].visible = false;
	}

	redo(state) {
		const targetId = this.targetObject.id;
		state.selectedShapeId = targetId;
		state.shapesMap[targetId].visible = true;
	}
}
