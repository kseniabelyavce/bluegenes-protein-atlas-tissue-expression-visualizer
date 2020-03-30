/* eslint-disable indent */
import React from 'react';
import queryData from './queryData';
import Loading from './components/Loading';
import {
	ResultTable,
	calculateOverallStrength
} from './components/ResultTable';

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sortedbyOrganName: null,
			sortedByCellAmount: null,
			sordedByOverallExpression: null,
			data: null,
			error: null,
			loading: true,
			table: []
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}

	handleClick(event) {
		document.querySelectorAll('span').forEach(key => {
			key.innerHTML = '▲';
		});
		event.target.innerHTML = '▼';
		this.handleSort(event.target.className);
	}

	handleSort(column) {
		switch (column) {
			case 'cells':
				this.setState({ data: this.state.sortedByCellAmount });
				break;
			case 'overall':
				this.setState({ data: this.state.sordedByOverallExpression });
				break;
			case 'organ':
				this.setState({ data: this.state.sortedbyOrganName });
				break;
		}
	}

	componentDidMount() {
		const {
			serviceUrl,
			entity: { value }
		} = this.props;

		queryData(value, serviceUrl)
			.then(res => {
				const map = {};
				const sortedByOrganMap = {};
				const sortedByCellMap = {};
				const sortedByOverallMap = {};

				res.proteinAtlasExpression.forEach(r => {
					const cells = map[r.tissue.tissueGroup.name] || [];
					cells.push(r);
					map[r.tissue.tissueGroup.name] = cells;
				});
				Object.keys(map)
					.sort()
					.forEach(key => {
						sortedByOrganMap[key] = map[key];
					});

				Object.keys(map)
					.sort((a, b) => {
						return map[b].length - map[a].length;
					})
					.forEach(key => {
						sortedByCellMap[key] = map[key];
					});

				Object.keys(map)
					.sort((a, b) => {
						return (
							calculateOverallStrength(map[b]) -
							calculateOverallStrength(map[a])
						);
					})
					.forEach(key => {
						sortedByOverallMap[key] = map[key];
					});

				this.setState({
					loading: false,
					data: sortedByOrganMap,
					sortedbyOrganName: sortedByOrganMap,
					sortedByCellAmount: sortedByCellMap,
					sordedByOverallExpression: sortedByOverallMap
				});
			})
			.catch(error => this.setState({ error }));
	}

	render() {
		return (
			<div className="rootContainer">
				<p className="title">Protein Atlas Tissue Expression</p>
				{this.state.error ? (
					<div className="error">
						{this.state.error.message
							? 'Something went wrong!'
							: this.state.error}
					</div>
				) : this.state.loading ? (
					<Loading />
				) : (
					<ResultTable
						handleClick={this.handleClick}
						data={this.state.data}
						sortedByOrganName={this.state.sortedbyOrganName}
						sortedByCellAmount={this.state.sortedByCellAmount}
						sordedByOverallExpression={this.state.sortedByOverallExpression}
					/>
				)}
			</div>
		);
	}
}

export default RootContainer;
