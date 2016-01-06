/**
 * External dependencies
 */
import Chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import reduxFluxSync from '../';
import { receivePost } from 'state/posts/actions';

describe( 'reduxFluxSync', () => {
	let sandbox, store, dispatch, subscriberId;

	before( () => {
		Chai.use( sinonChai );

		sandbox = sinon.sandbox.create();
		sandbox.spy( Dispatcher, 'register' );
		dispatch = sandbox.spy();
		store = { dispatch };
	} );

	beforeEach( () => {
		if ( subscriberId ) {
			Dispatcher.unregister( subscriberId );
		}

		sandbox.reset();
	} );

	after( () => {
		sandbox.restore();
	} );

	it( 'should register to the dispatcher', () => {
		subscriberId = reduxFluxSync( store );

		expect( Dispatcher.register ).to.have.been.calledOnce;
	} );

	it( 'should return a dispatcher subscription ID', () => {
		subscriberId = reduxFluxSync( store );

		expect( subscriberId ).to.be.a( 'string' );
	} );

	it( 'should dispatch when having received a mapped action', () => {
		const post = { ID: 1 };
		subscriberId = reduxFluxSync( store );

		Dispatcher.handleServerAction( {
			type: 'RECEIVE_POST_TO_EDIT',
			post
		} );

		expect( dispatch ).to.have.been.calledWith( receivePost( post ) );
	} );
} );
