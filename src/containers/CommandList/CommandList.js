import React from "react";
import "./CommandList.css";

class CommandList extends React.Component {
	render() {
		const { commandList, currCommand } = this.props;

		return (
			<div className="command-list">
				<h2>Command List</h2>
				<ul>
					{commandList.map((command, index) => (
						<li
							key={index}
							className={
								index > currCommand
									? "unactive"
									: index < currCommand
									? ""
									: "active"
							}
						>
							<span>{command.getName()}</span>
							<span
								style={{
									backgroundColor:
										index > currCommand
											? "transparent"
											: command.newValue,
									color:
										command.getColor() === "#000"
											? "white"
											: "inherit",
								}}
							>
								{command.getColor()}
							</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

export default CommandList;
