/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import { receivePost } from 'state/posts/actions';

/**
 * Module variables
 */
const SYNC_ACTIONS = {
	RECEIVE_POST_TO_EDIT: ( action ) => receivePost( action.post )
};

export default function( store ) {
	return Dispatcher.register( ( payload ) => {
		let handler = SYNC_ACTIONS[ payload.action.type ];
		if ( handler ) {
			store.dispatch( handler( payload.action ) );
		}
	} );
}
