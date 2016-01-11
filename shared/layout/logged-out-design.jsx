/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import MasterbarLoggedOut from 'layout/masterbar/logged-out';
import Head from 'layout/head';

const LayoutLoggedOutDesign = ( { tier = 'all' } ) => (
	<div className="wp is-section-design has-no-sidebar">
		<Head
			title={ get( 'title', tier ) }
			description={ get( 'description', tier ) }
			canonicalUrl={ get( 'canonicalUrl', tier ) }
		/>
		<MasterbarLoggedOut />
		<div id="content" className="wp-content">
			<div id="primary" className="wp-primary wp-section" />
			<div id="secondary" className="wp-secondary" />
		</div>
		<div id="tertiary" className="wp-overlay fade-background" />
	</div>
)

LayoutLoggedOutDesign.displayName = 'LayoutLoggedOutDesign';
LayoutLoggedOutDesign.propTypes = {
	tier: React.PropTypes.string
}

const designMeta = {
	all: {
		title: 'WordPress Themes',
		description: 'Beautiful, responsive, free and premium WordPress themes for your photography site, portfolio, magazine, business website, or blog.',
		canonicalUrl: 'https://wordpress.com/design',
	},
	free: {
		title: 'Free WordPress Themes at WordPress.com',
		description: 'Discover Free WordPress Themes on the WordPress.com Theme Showcase.',
		canonicalUrl: 'https://wordpress.com/design/type/free',
	},
	premium: {
		title: 'Premium WordPress Themes at WordPress.com',
		description: 'Discover Premium WordPress Themes on the WordPress.com Theme Showcase.',
		canonicalUrl: 'https://wordpress.com/design/type/premium',
	}
}

function get( key, tier ) {
	return tier in designMeta && key in designMeta[ tier ]
	? designMeta[ tier ][ key ]
	: '';
}

export default LayoutLoggedOutDesign;
