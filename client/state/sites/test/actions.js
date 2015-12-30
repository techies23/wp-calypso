/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { RECEIVE_SITE } from 'state/action-types';
import { receiveSite } from '../actions';

function mockedDispatch( callback ) {
	return callback();
}

describe( 'actions', () => {
	describe( '#receiveSite()', () => {
		it( 'should return an action object', () => {
			const site = { ID: 2916284, name: 'WordPress.com Example Blog' };
			const action = receiveSite( site );

			expect( action ).to.eql( {
				type: RECEIVE_SITE,
				site
			} );
		} );
	} );
} );
