/**
 * This is a temporary file to assist development of the support user feature.
 */

import User from './user';
import config from 'config';

 // TODO: This will be replaced with a UI
if ( config.isEnabled( 'support-user' ) ) {
	let user = new User();

	const callback = ( error ) => {
		if ( error ) {
			console.error( error );
		} else {
			console.log( 'success' );
		}
	};

	window.supportUser = {
		login: ( username, password ) => user.changeUser( username, password, callback ),
		logout: () => user.restoreUser()
	};
}
