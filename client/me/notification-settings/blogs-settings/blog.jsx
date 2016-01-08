/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
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
		// onToggle: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		onSaveToAll: PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			isExpanded: false
		};
	},

	render() {
		const { blog, blog: { ID: sourceId }, settings, disableToggle, devices, hasUnsavedChanges, onToggle, onSave, onSaveToAll } = this.props;
		const { isExpanded } = this.state;
		const styles = classNames( 'notification-settings-blog-settings-blog', {
			'is-compact': ! isExpanded,
			'is-expanded': isExpanded
		} );

		return (
			<FoldableCard
				className={ styles }
				header={ <Header { ...{ blog, settings } } /> } >
					<SettingsForm
						{ ...{ sourceId, devices, settings, hasUnsavedChanges, isApplyAllVisible: ! disableToggle, onToggle, onSave, onSaveToAll } }
						settingKeys={ [ 'new_comment', 'comment_like', 'post_like', 'follow', 'achievement', 'mentions' ] } />
			</FoldableCard>
		);
	}
} );
