/**
 * Internal dependencies
 */
import { RECEIVE_SITE_STATS } from 'state/action-types';

/**
 * Returns an action object to be used in signalling that a site stats object has
 * been received.
 *
 * @param  {Object} siteStats The Site Stats received
 * @return {Object}      Action object
 */
export function receiveSite( siteStats ) {
	return {
		type: RECEIVE_SITE_STATS,
		siteStats
	};
}
