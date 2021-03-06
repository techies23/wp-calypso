/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

export default React.createClass( {
	displayName: 'NoticeAction',

	propTypes: {
		href: React.PropTypes.string,
		onClick: React.PropTypes.func,
		external: React.PropTypes.bool
	},

	getDefaultProps() {
		return {
			external: false
		};
	},

	render() {
		const attributes = {
			className: 'notice__action',
			href: this.props.href,
			onClick: this.props.onClick
		};

		if ( this.props.external ) {
			attributes.target = '_blank';
		}

		return (
			<a {...attributes} >
				<span>{ this.props.children }</span>
				{ this.props.external && <Gridicon icon="external" size={ 24 } /> }
			</a>
		);
	}
} );
