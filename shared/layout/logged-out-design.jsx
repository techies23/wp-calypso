/**
 * External dependencies
 */
import React from 'react';
import Helmet from 'react-helmet';

/**
 * Internal dependencies
 */
import MasterbarLoggedOut from 'layout/masterbar/logged-out';

const TITLE = 'Foo';
const CANONICAL_URL = 'https://wordpress.com/foo';

const LayoutLoggedOutDesign = () => (
	<div className="wp is-section-design has-no-sidebar">
		<Helmet
			title={ TITLE }
			meta={ [
				{ name: 'description', property: 'og:description', content: 'DESCRIPTION' },
				{ property: 'og:title', content: TITLE },
				{ property: 'og:url', content: CANONICAL_URL },
			] }
			link={ [
				{ rel: 'canonical', href: CANONICAL_URL }
			] }
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

export default LayoutLoggedOutDesign;
