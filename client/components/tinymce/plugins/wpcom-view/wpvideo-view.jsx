/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import shortcodeUtils from 'lib/shortcode';

const WpVideoView = React.createClass( {

	statics: {
		match( content ) {
			const match = shortcodeUtils.next( 'wpvideo', content );

			if ( match ) {
				return {
					index: match.index,
					content: match.content,
					options: {
						shortcode: match.shortcode
					}
				};
			}
		},

		serialize( content ) {
			return encodeURIComponent( content );
		}
	},

	getEmbedUrl() {
		var videopress_guid = shortcodeUtils.parse( this.props.content ).attrs.numeric[0];
		return `https://videopress.com/embed/${ videopress_guid }`;
		},

	render() {
		return (
			<iframe
				src={ this.getEmbedUrl() }
				frameBorder="0"
				allowFullScreen />
		);
	}

} );

export default WpVideoView;
