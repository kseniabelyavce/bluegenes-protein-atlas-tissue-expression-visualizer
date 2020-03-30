import React from 'react';
import ResultRow from './ResultRow';
import { STRENGTHS } from '../constants';

function calculateOverallStrength(cells) {
	let totalStaining = 0;
	cells.forEach(cell => (totalStaining += STRENGTHS[cell.level]));
	return Math.floor(totalStaining / cells.length);
}

class ResultTable extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { data } = this.props;
		return (
			<table cellSpacing={8}>
				<thead>
					<tr>
						<th>
							<span className="overall" onClick={this.props.handleClick}>
								▲
							</span>
							Overall
						</th>
						<th>
							<span className="organ" onClick={this.props.handleClick}>
								▼
							</span>
							Organ
						</th>
						<th>
							<span className="cells" onClick={this.props.handleClick}>
								▲
							</span>
							Cells
						</th>
						<th>Antibody Staining</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(data).map(key => (
						<ResultRow
							key={key}
							organName={key}
							cells={data[key]}
							overall={calculateOverallStrength(data[key])}
						/>
					))}
				</tbody>
			</table>
		);
	}
}

export { ResultTable, calculateOverallStrength };
