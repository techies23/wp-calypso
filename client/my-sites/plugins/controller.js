/**
 * External Dependencies
 */
var ReactDom = require( 'react-dom' ),
	React = require( 'react' ),
	page = require( 'page' ),
	some = require( 'lodash/collection/some' ),
	capitalize = require( 'lodash/string/capitalize' );

/**
 * Internal Dependencies
 */
var route = require( 'lib/route' ),
	i18n = require( 'lib/mixins/i18n' ),
	notices = require( 'notices' ),
	sites = require( 'lib/sites-list' )(),
	analytics = require( 'analytics' ),
	PluginListComponent = require( './main' ),
	PluginComponent = require( './plugin' ),
	PluginBrowser = require( './plugins-browser' ),
	titleActions = require( 'lib/screen-title/actions' ),
	JetpackManageErrorPage = require( 'my-sites/jetpack-manage-error-page' ),
	PlanSetup = require( './plan-setup' ),
	PlanSetupInstructions = require( './plan-setup/instructions' ),
	allowedCategoryNames = [ 'new', 'popular', 'featured' ];

/**
 * Module variables
 */
var lastPluginsListVisited,
	lastPluginsQuerystring,
	controller;

const businessPlugins = [ 'gumroad', 'shopify-store', 'ecwid' ];

function renderSinglePlugin( context, siteUrl, isWpcomPlugin ) {
	var pluginSlug = decodeURIComponent( context.params.plugin ),
		site = sites.getSelectedSite(),
		analyticsPageTitle = 'Plugins',
		baseAnalyticsPath;

	baseAnalyticsPath = 'plugins/:plugin';
	if ( site ) {
		baseAnalyticsPath += '/:site';
	}

	if ( site &&
		site.jetpack &&
		context.path.indexOf( '/business' ) >= 0 &&
		businessPlugins.indexOf( pluginSlug ) >= 0
	) {
		return page.redirect( '/plugins/' + pluginSlug + '/' + site.slug );
	}

	if (
		( ! site || ! site.jetpack ) &&
		businessPlugins.indexOf( pluginSlug ) >= 0 &&
		context.path.indexOf( '/business' ) < 0
	) {
		return page.redirect( '/plugins/' + pluginSlug + '/business' + ( site ? '/' + site.slug : '' ) );
	}

	analytics.pageView.record( baseAnalyticsPath, analyticsPageTitle + ' > Plugin Details' );

	// Scroll to the top
	window.scrollTo( 0, 0 );

	// Render single plugin component
	ReactDom.render(
		React.createElement( PluginComponent, {
			path: context.path,
			prevPath: lastPluginsListVisited || context.prevPath,
			prevQuerystring: lastPluginsQuerystring,
			sites: sites,
			pluginSlug: pluginSlug,
			siteUrl: siteUrl,
			isWpcomPlugin: isWpcomPlugin,
			onPluginRefresh: title => titleActions.setTitle( title )
		} ),
		document.getElementById( 'primary' )
	);
}

function getPathWithoutSiteSlug( context, site ) {
	let path = context.pathname;
	if ( site && site.slug ) {
		path = path.replace( '/' + site.slug, '' );
	}
	return path;
}

function renderPluginList( context, basePath, siteUrl ) {
	var search = context.query.s,
		site = sites.getSelectedSite(),
		analyticsPageTitle;

	lastPluginsListVisited = getPathWithoutSiteSlug( context, site );
	lastPluginsQuerystring = context.querystring;

	titleActions.setTitle( i18n.translate( 'Plugins', { textOnly: true } ), { siteID: siteUrl } );

	// Render multiple plugins component
	ReactDom.render(
		React.createElement( PluginListComponent, {
			path: basePath,
			context: context,
			filter: context.params.pluginFilter,
			sites: sites,
			search: search
		} ),
		document.getElementById( 'primary' )
	);

	if ( search ) {
		analytics.ga.recordEvent( 'Plugins', 'Search', 'Search term', search );
	}

	analyticsPageTitle = 'Plugins' + ( context.params.pluginFilter ? ' ' + capitalize( context.params.pluginFilter ) : '' );
	analytics.pageView.record( context.pathname.replace( site.domain, ':site' ), analyticsPageTitle );
}

function renderPluginsBrowser( context, siteUrl ) {
	var site = sites.getSelectedSite(),
		category = context.params.category,
		searchTerm = context.query.s,
		analyticsPageTitle;

	lastPluginsListVisited = getPathWithoutSiteSlug( context, site );
	lastPluginsQuerystring = context.querystring;

	if ( context.params.siteOrCategory &&
			allowedCategoryNames.indexOf( context.params.siteOrCategory ) >= 0 ) {
		category = context.params.siteOrCategory;
	}
	if ( ! site && allowedCategoryNames.indexOf( context.params.siteOrCategory ) < 0 ) {
		site = { slug: context.params.siteOrCategory };
	}

	titleActions.setTitle( i18n.translate( 'Plugin Browser', { textOnly: true } ), { siteID: siteUrl } );

	analyticsPageTitle = 'Plugin Browser' + ( category ? ': ' + category : '' );
	analytics.pageView.record( context.pathname.replace( site.domain, ':site' ), analyticsPageTitle );

	ReactDom.render(
		React.createElement( PluginBrowser, {
			site: site ? site.slug : null,
			path: context.path,
			category: category,
			sites: sites,
			search: searchTerm
		} ),
		document.getElementById( 'primary' )
	);
}

function renderNoManageWarning() {
	let site = sites.getSelectedSite();
	ReactDom.render(
		React.createElement( JetpackManageErrorPage, {
			site: site,
			template: 'optInManage',
			title: i18n.translate( 'Oh no! We can\'t automatically install your new plugins.' ),
			section: 'plugins',
			illustration: '/calypso/images/jetpack/jetpack-manage.svg',
		} ),
		document.getElementById( 'primary' )
	);
}

function renderCantFileEdit() {
	let site = sites.getSelectedSite();
	ReactDom.render(
		React.createElement( PlanSetupInstructions, {
			selectedSite: site,
		} ),
		document.getElementById( 'primary' )
	);
}

function renderProvisionPlugins() {
	let site = sites.getSelectedSite();
	ReactDom.render(
		React.createElement( PlanSetup, {
			selectedSite: site,
		} ),
		document.getElementById( 'primary' )
	);
}

controller = {

	plugins: function( filter, context ) {
		var basePath = route.sectionify( context.path ),
			siteUrl = route.getSiteFragment( context.path );

		context.params.pluginFilter = filter;
		basePath = basePath.replace( '/' + filter, '' );
		notices.clearNotices( 'notices' );
		renderPluginList( context, basePath, siteUrl );
	},

	plugin: function( context ) {
		var isWpcomPlugin = 'business' === context.params.business_plugin,
			siteUrl = route.getSiteFragment( context.path );

		if ( context.params.plugin && context.params.plugin === siteUrl ) {
			controller.plugins( 'all', context );
			return;
		}

		notices.clearNotices( 'notices' );
		renderSinglePlugin( context, siteUrl, isWpcomPlugin );
	},

	browsePlugins: function( context ) {
		var siteUrl = route.getSiteFragment( context.path );

		renderPluginsBrowser( context, siteUrl );
	},

	setupPlugins: function() {
		let selectedSite = sites.getSelectedSite();

		// Not a Jetpack plan
		if ( 0 !== selectedSite.plan.product_slug.indexOf( 'jetpack_' ) ) {
			page.redirect( '/plugins' );
			return;
		// Not a paid plan (nothing to set up)
		} else if ( 'jetpack_free' === selectedSite.plan.product_slug ) {
			page.redirect( '/plans/' + selectedSite.slug );
			return;
		}

		if ( ! selectedSite.canManage() ) {
			renderNoManageWarning();
			return;
		}

		if ( ! selectedSite.canUpdateFiles ) {
			renderCantFileEdit();
			return;
		}

		renderProvisionPlugins();
	},

	jetpackCanUpdate: function( filter, context, next ) {
		let redirectToPlugins = false,
			selectedSites = sites.getSelectedOrAllWithPlugins();

		if ( 'updates' === filter && selectedSites.length ) {
			redirectToPlugins = ! some( sites.getSelectedOrAllWithPlugins(), function( site ) {
				return site && site.jetpack && site.canUpdateFiles;
			} );

			if ( redirectToPlugins ) {
				if ( context.params && context.params.site_id ) {
					page.redirect( '/plugins/' + context.params.site_id );
					return;
				}
				page.redirect( '/plugins' );
				return;
			}
		}
		next();
	}

};

module.exports = controller;
