'use strict';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import './activity-card-list.js';
import '../styles/discovery-styles.js';

import { FetchMixin } from '../mixins/fetch-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class HomeListSection extends RouteLocationsMixin(FetchMixin(LitElement)) {

	render() {
		return html`
			<style include="discovery-styles"></style>
			<div class="d2l-typography">
				<div class="discovery-home-list-section-container" ?hidden="${!this._hasCourses(this._sortedCourses)}">
					<div class="activity-card-list-header">
						<h2 class="d2l-heading-2">${this.sectionName}</h2>
						<d2l-link
							aria-label="${this.linkLabel}"
							class="activity-card-list-header-view-all-link"
							href="javascript:void(0)"
							@click="${this._navigateToViewAll}">
							${this.linkName}
						</d2l-link>
					</div>
					<activity-card-list
						.activities="${this._sortedCourses}"
						token="${this.token}">
					</activity-card-list>
				</div>
			</div>
		`;
	}

	static get styles() {
		return [
			heading2Styles,
			bodyCompactStyles,
			bodyStandardStyles,
			css`
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
			`
		];
	}

	static get properties() {
		return {
			sort: {
				type: String
			},
			sectionName: {
				type: String
			},
			linkLabel: {
				type: String
			},
			linkName: {
				type: String
			},
			token: {
				type: String
			},
			_pageSize: {
				type: Number
			},
			_sortedCourses: {
				type: Array,
			}
		};
	}

	constructor() {
		super();
		this._pageSize = 4;
		this._sortedCourses = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));
		this._updateCourses();
	}

	disconnectedCallback() {
		document.removeEventListener('d2l-activity-card-clicked', this._navigateToCourse.bind(this));
		super.disconnectedCallback();
	}

	_reset() {
		this._sortedCourses = [];
	}

	_hasCourses(_sortedCourses) {
		return Array.isArray(_sortedCourses) && _sortedCourses.length > 0;
	}

	_getSortedCourses() {
		const searchAction = 'search-activities';
		const parameters = {
			page: 0,
			pageSize: this._pageSize,
			sort: this.sort
		};

		return this._getActionUrl(searchAction, parameters)
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

customElements.define('home-list-section', HomeListSection);
