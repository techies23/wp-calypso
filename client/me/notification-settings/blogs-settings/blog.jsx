/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FoldableCard from 'components/foldable-card';
import Header from './header';
import SettingsForm from 'me/notification-settings/settings-form';

export default React.createClass( {
	displayName: 'BlogSettings',

	propTypes: {
		blog: PropTypes.object.isRequired,
		devices: PropTypes.object,
		disableToggle: PropTypes.bool,
		settings: PropTypes.instanceOf( Immutable.Map ).isRequired,
		hasUnsavedChanges: PropTypes.bool.isRequired,
		onToggle: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		onSaveToAll: PropTypes.func.isRequired
	},

	render() {
		const { blog, blog: { ID: sourceId }, settings, disableToggle, devices, hasUnsavedChanges, onToggle, onSave, onSaveToAll } = this.props;

		if ( disableToggle ) {
			return (
				<Card className="notification-settings-blog-settings-blog is-compact">
					<Header { ...{ blog, settings } } />
					<SettingsForm
						{ ...{ sourceId, devices, settings, hasUnsavedChanges, isApplyAllVisible: ! disableToggle, onToggle, onSave, onSaveToAll } }
						settingKeys={ [ 'new_comment', 'comment_like', 'post_like', 'follow', 'achievement', 'mentions' ] } />
				</Card>
			);
		}

		return (
			<FoldableCard
				className="notification-settings-blog-settings-blog is-compact"
				header={ <Header { ...{ blog, settings } } /> } >
					<SettingsForm
						{ ...{ sourceId, devices, settings, hasUnsavedChanges, isApplyAllVisible: ! disableToggle, onToggle, onSave, onSaveToAll } }
						settingKeys={ [ 'new_comment', 'comment_like', 'post_like', 'follow', 'achievement', 'mentions' ] } />
			</FoldableCard>
		);
	}
} );
