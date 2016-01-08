/**
 * External dependencies
 */
import React from 'react';
import Helmet from 'react-helmet';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { decodeEntities } from 'lib/formatting';

const debug = debugFactory( 'calypso:layout:head' );

const Head = ( { title, description, canonicalUrl } ) => (
	<Helmet
		title={ buildTitle( title ) }
		meta={ [
			{ name: 'description', property: 'og:description', content: description },
			{ property: 'og:title', content: title },
			{ property: 'og:url', content: canonicalUrl },
		] }
		link={ [
			{ rel: 'canonical', href: canonicalUrl }
		] }
		onChangeClientState={ debug }
	/>
);

Head.displayName = 'Head';
Head.propTypes = {
	title: React.PropTypes.string,
	description: React.PropTypes.string,
	canonicalUrl: React.PropTypes.string,
};

// TODO: use `lib/screen-title/utils`, which currently depends on sites-list
// and isn't server-ready
function buildTitle( title ) {
	return title
		? decodeEntities( title ) + ' — WordPress.com'
		: 'WordPress.com';
}

export default Head;
