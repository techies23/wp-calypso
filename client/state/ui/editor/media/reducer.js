/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { EDITOR_MEDIA_TOGGLE_ADVANCED } from 'state/action-types';

function advanced( state = false, action ) {
	switch ( action.type ) {
		case EDITOR_MEDIA_TOGGLE_ADVANCED:
			state = ! state;
			break;
	}

	return state;
}

export default combineReducers( {
	advanced
} );
