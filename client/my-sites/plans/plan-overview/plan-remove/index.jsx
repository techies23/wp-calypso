/**
 * External dependencies
 */
import React from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import Dialog from 'components/dialog';
import { isInGracePeriod } from 'lib/plans';
import paths from '../../paths';

const PlanRemove = React.createClass( {
	propTypes: {
		plan: React.PropTypes.object.isRequired,
		selectedSite: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.bool
		] ).isRequired
	},

	getInitialState() {
		return {
			showDialog: false
		};
	},

	closeDialog( action ) {
		this.setState( { showDialog: false } );

		if ( action === 'remove' ) {
			// TODO: Add action that calls the API and cancels the free trial

			// TODO: Display success notice

			page( paths.list( this.props.selectedSite.slug ) );
		}
	},

	showDialog() {
		this.setState( { showDialog: true } );
	},

	renderCard() {
		return (
			<CompactCard className="plan-remove">
				<strong>{ this.translate( 'Not looking to purchase?' ) }</strong>
				{ ' ' }
				{ this.translate( 'No problem, you can remove the plan and all its features from your site.' ) }
				{ ' ' }
				<a href="#" onClick={ this.showDialog }>{ this.translate( 'Remove now.' ) }</a>
			</CompactCard>
		);
	},

	renderDialog() {
		const buttons = [
			{ action: 'cancel', label: this.translate( 'Cancel' ) },
			{ action: 'remove', label: this.translate( 'Remove Now' ), isPrimary: true }
		];

		return (
			<Dialog
				buttons={ buttons }
				isVisible={ this.state.showDialog }
				onClose={ this.closeDialog }>
				<h1>{ this.translate( 'Remove Free Trial' ) }</h1>

				<p>
					{ this.translate( 'Are you sure you want to end your {{strong}}%(planName)s{{/strong}} free trial and remove it from {{em}}%(siteName)s{{/em}}? ', {
						args: {
							planName: this.props.plan.productName,
							siteName: this.props.selectedSite.name || this.props.selectedSite.title
						},
						components: {
							em: <em />,
							strong: <strong />
						}
					} ) }
					{ ' ' }
					{ this.translate( 'You will lose any custom changes you have made.' ) }
				</p>
			</Dialog>
		);
	},

	render() {
		if ( isInGracePeriod( this.props.plan ) ) {
			return (
				<div>
					{ this.renderCard() }
					{ this.renderDialog() }
				</div>
			);
		}

		return null;
	}
} );

export default PlanRemove;
