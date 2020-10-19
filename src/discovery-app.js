import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import './components/app-location-ifrau.js';
import './discovery-404.js';
import './discovery-course.js';
import './discovery-home.js';
import './discovery-search.js';
import './discovery-settings.js';

import { IfrauMixin } from './mixins/ifrau-mixin.js';
import { FeatureMixin } from './mixins/feature-mixin.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
window.DiscoveryApp = window.DiscoveryApp || {};
setRootPath(window.DiscoveryApp.rootPath);

class DiscoveryApp extends FeatureMixin(RouteLocationsMixin(IfrauMixin(PolymerElement))) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>

			<app-location-ifrau
				route="[[route]]"
				query-params="[[queryParams]]">
			</app-location-ifrau>

			<app-route
				route="[[route]]"
				pattern="/d2l/le/discovery/view/:page"
				data="[[routeData]]"
				tail="[[subroute]]">
			</app-route>

			<iron-pages
				selected="[[page]]"
				attr-for-selected="name"
				selected-attribute="visible"
				role="main">
				<discovery-home
					name="home" href="[[href]]" token="[[token]]"
					promoted-courses-enabled="[[_promotedCoursesEnabled]]"
					can-manage-discover="[[_manageDiscover]]">
				</discovery-home>

				<discovery-course
					name="course" route="[[route]]"
					href="[[href]]" token="[[token]]">
				</discovery-course>

				<discovery-search
					name="search" route="[[route]]"
					href="[[href]]" token="[[token]]">
				</discovery-search>
				<discovery-settings
					name="settings" href="[[href]]" token="[[token]]"
					can-manage-discover="[[_manageDiscover]]"
					discover-customizations-enabled = "[[_discoverCustomizationsEnabled]]"
					discover-toggle-sections-enabled = "[[_discoverToggleSectionsEnabled]]">
				</discovery-settings>
				<discovery-404 name="404"></discovery-404>
			</iron-pages>
		`;
	}
	static get properties() {
		return {
			page: {
				type: String,
				reflectToAttribute: true
			},
			queryParams: {
				type: Object,
				value: () => {
					return {};
				}
			},
			routeData: Object,
			subroute: Object,
			options: {
				type: String,
				observer: '_optionsChanged'
			},
			token: {
				type: String,
				observer: '_tokenChanged'
			},
			_promotedCoursesEnabled: {
				type: Boolean
			},
			_manageDiscover: {
				type: Boolean
			},
			_discoverCustomizationsEnabled: {
				type: Boolean
			},
			_discoverToggleSectionsEnabled: {
				type: Boolean
			}
		};
	}
	constructor() {
		super();
		this.page="home";
		this._routeDataChangedHandled = this._routeDataChanged.bind(this);
	}
	ready() {
		super.ready();
		this.addEventListener('navigate', this._navigate);
		this.addEventListener('navigate-parent', this._navigateParent);

		const location = this.shadowRoot.querySelector('app-location-ifrau');
		location.addEventListener('route-changed', this._routeChanged.bind(this));
		location.addEventListener('query-params-changed', this._queryParamsChanged.bind(this));

		const route = this.shadowRoot.querySelector('app-route');
		route.addEventListener('route-changed', this._routeChanged.bind(this));
		route.addEventListener('tail-changed', this._subrouteChanged.bind(this));
		route.addEventListener('data-changed', this._routeDataChanged.bind(this));
	}
	_navigate(e) {
		if (e && e.detail) {
			if (e.detail.resetPages) {
				e.detail.resetPages.forEach((page) => {
					this._resetPage(page);
				});
			}
			if (e.detail.path) {
				this.set('route.path', e.detail.path);
			}
		}
	}
	_navigateParent(e) {
		if (e && e.detail && e.detail.path) {
			this._ifrauNavigationGo(e.detail.path);
		}
	}

	//Assigns feature/flags/endpoint/other information from LMS.
	_optionsChanged(optionsJSON) {
		window.D2L.frau.options = JSON.parse(optionsJSON);
		window.D2L.bffEndpoint = window.D2L.frau.options.endpoint;
		this._computeFlagProperties();
	}

	//Retrieves a token for interacting with the BFF
	async _tokenChanged(newValue, oldValue) {
		if(!oldValue) {
			this.token = await newValue();
			window.D2L.token = this.token;
		}
	}

	_computeFlagProperties() {
		this._promotedCoursesEnabled = this._isPromotedCoursesEnabled();
		this._manageDiscover = this._canManageDiscover();
		this._discoverCustomizationsEnabled = this._isDiscoverCustomizationsEnabled();
		this._discoverToggleSectionsEnabled = this._isDiscoverToggleSectionsEnabled();
	}

	_routeChanged(route) {
		route = route.detail.value || {};

		//If a user navigated via browser back/forward functionality, the path of the routes will be different.
		if (this.route && this.route.path !== route.path) {
			if (this.route.path === '/d2l/le/discovery/view/settings') {
				this._resetPage('settings');
			}
		}

		this.route = route;
		if (route.path === '/d2l/le/discovery/view/') { // navlink home
			var appLocationIfrau = this.shadowRoot.querySelector('app-location-ifrau');
			if (appLocationIfrau) {
				appLocationIfrau.rewriteTo(this.routeLocations().home());
			}
		}
	}
	_routeDataChanged(routeData) {
		routeData = routeData.detail.value || {};
		this.routeData = routeData;
		const page = routeData.page || null;
		if (page && ['home', 'course', 'search', 'settings'].indexOf(page) !== -1) {
			this.page = page;
		} else if (page) {
			this.page = '404';
		}
	}
	_subrouteChanged(subroute) {
		subroute = subroute.detail.value || {};
		this.subroute = subroute;
	}
	_queryParamsChanged(queryParams) {
		queryParams = queryParams.detail.value || {};
		this.queryParams = queryParams;
	}
	_resetPage(pageName) {
		const pageElement = this.shadowRoot.querySelector(`[name="${pageName}"]`);
		if (pageElement && typeof pageElement._reset === 'function') {
			pageElement._reset();
		}
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
