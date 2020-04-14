'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './activity-card-list.js';
import '../styles/discovery-styles.js';
import 'd2l-typography/d2l-typography.js';

import { FetchMixin } from '../mixins/fetch-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class HomeListSection extends RouteLocationsMixin(FetchMixin(LocalizeMixin(PolymerElement))) {
	static get template() {

		return html`
			<style include="d2l-typography"></style>
			<style include="discovery-styles">
				.discovery-home-list-section-container {
					display: flex;
					flex-direction: column;
				}

				.activity-card-list-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.activity-card-list-header-view-all-link {
					@apply --d2l-body-compact-text;
				}

				@media only screen and (max-width: 615px) {
					.activity-card-list-header-view-all-link {
						font-size: 0.7rem;
					}
				}
			</style>

			<div class="d2l-typography">
				<div class="discovery-home-list-section-container" hidden$="[[!_showSection]]">
					<div class="activity-card-list-header">
						<h2 class="d2l-heading-2">[[sectionName]]</h2>
						<d2l-link
							class="activity-card-list-header-view-all-link"
							href="javascript:void(0)"
							on-click="_navigateToViewAll">
							[[localize('viewAll')]]
						</d2l-link>
					</div>
					<activity-card-list
						activities="[[_sortedCourses]]"
						token="[[token]]">
					</activity-card-list>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			sort: String,
			sectionName: String,
			_pageSize: {
				type: Number,
				value: 4
			},
			_sortedCourses: {
				type: Array,
				value: function() { return []; }
			},
			_showSection: {
				type: Boolean,
				computed: '_hasCourses(_sortedCourses)'
			},
			token: String
		};
	}

	ready() {
		super.ready();
		this.addEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));
		this._updateCourses();
	}

	static get _searchAction() {
		return 'search-activities';
	}

	_reset() {
		this._sortedCourses = [];
	}

	_hasCourses(_sortedCourses) {
		return Array.isArray(_sortedCourses) && _sortedCourses.length > 0;
	}

	_getSortedCourses() {
		const parameters = {
			page: 0,
			pageSize: this._pageSize,
			sort: this.sort
		};

		return this._getActionUrl(this._searchAction, parameters)
			.then(url => {
				return this._fetchEntity(url)
					.then(this._handleSearchResponse.bind(this))
					.catch(() => {
						this._reset();
					});
			})
			.catch(() => {
				this._reset();
			});
	}

	_handleSearchResponse(sirenEntity) {
		if (!sirenEntity || !sirenEntity.properties) {
			return;
		}

		return {
			entities: sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com')
		};
	}

	_navigateToCourse(e) {
		e.stopPropagation();
		if (e && e.detail && e.detail.orgUnitId) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().course(e.detail.orgUnitId)
				},
				bubbles: true,
				composed: true
			}));
		}
	}

	_updateCourses() {
		// Fill with empty slots first - for loading
		this._sortedCourses = new Array(this._pageSize);

		// Get new items
		this._updateToken();
		this._getSortedCourses()
			.then((res) => {
				if (res && res.entities) {
					this._sortedCourses = res.entities;
				}
			});
	}

	_navigateToViewAll() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().search('', { sort: this.sort })
			},
			bubbles: true,
			composed: true
		}));
	}

	_updateToken() {
		return this._getToken()
			.then((token) => {
				this.token = token;
			});
	}
}

window.customElements.define('home-list-section', HomeListSection);
