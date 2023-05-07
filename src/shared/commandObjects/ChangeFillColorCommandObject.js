import CommandObject from "./CommandObject";

export default class ChangeFillColorCommandObject extends CommandObject {
	constructor(undoHandler) {
		super(undoHandler, true);
	}
	getName() {
		return "Change " + this.targetObject.type + " fill Color to ";
	}
	getColor() {
		if (this.newValue) {
			return this.newValue;
		} else {
			return "Unknown Color";
		}
	}

	/* override to return true if this command can be executed,
	 *  e.g., if there is an object selected
	 */
	canExecute(selectedObj) {
		return selectedObj !== null; // global variable for selected
	}

	/* override to execute the action of this command.
	 * pass in false for addToUndoStack if this is a command which is NOT
	 * put on the undo stack, like Copy, or a change of selection or Save
	 */
	execute(state, fillColor) {
		const selectedObj = state.shapesMap[state.selectedShapeId];

		if (selectedObj !== null) {
			this.targetObject = selectedObj; // global variable for selected
			this.oldValue = selectedObj.fillColor; // object's current color
			this.newValue = fillColor; // get the color widget's current color
			this.targetObject.fillColor = this.newValue; // actually change

			// Note that this command object must be a NEW command object so it can be
			// registered to put it onto the stack
			if (this.addToUndoStack) this.undoHandler.registerExecution(this);
		}
	}

	/* override to undo the operation of this command
	 */
	undo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update local object color
		this.targetObject.fillColor = this.oldValue;

		// change state of shapes map
		state.shapesMap[targetId].fillColor = this.oldValue;

		// the palette
		state.currFillColor = this.oldValue;
	}

	/* override to redo the operation of this command, which means to
	 * undo the undo. This should ONLY be called if the immediate
	 * previous operation was an Undo of this command. Anything that
	 * can be undone can be redone, so there is no need for a canRedo.
	 */
	redo(state) {
		const targetId = this.targetObject.id;

		// select
		state.selectedShapeId = targetId;

		// update local object color
		this.targetObject.fillColor = this.newValue;

		// change state of shapes map
		state.shapesMap[targetId].fillColor = this.newValue;

		// the palette
		state.currFillColor = this.newValue;
	}
}
