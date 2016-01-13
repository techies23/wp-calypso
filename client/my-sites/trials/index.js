/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import controller from 'my-sites/controller';
import trialsController from './controller';
import adTracking from 'analytics/ad-tracking';
import config from 'config';

module.exports = function() {
	if ( config.isEnabled( 'manage/plans' ) ) {
		page( '/start-trial',
			adTracking.retarget,
			controller.siteSelection,
			trialsController.startTrial
		);
	}
};
