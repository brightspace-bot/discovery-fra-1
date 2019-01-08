import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import './components/search-input.js';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-fetch-auth/d2l-fetch-auth-framed.js';
import 'd2l-activities/components/d2l-activity-list-item/d2l-activity-list-item.js';

/**
 * @customElement
 * @polymer
 */
class DiscoveryApp extends mixinBehaviors([D2L.PolymerBehaviors.FetchSirenEntityBehavior], PolymerElement) {
	constructor() {
		super();
		window.d2lfetch.use({name: 'auth', fn: window.d2lfetch.auth});
	}
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
				.discovery-flex-container {
					display: flex;
				}
				.discovery-search {
					width: 80%;
					height: 100vh;
				}
				.discovery-search d2l-activity-list-item {
					margin: 0.5rem;
				}
			</style>
			<h2>Discovery</h2>
			<div class="discovery-flex-container">
				<div>
					<img src="images/disco-self.png" />
				</div>
				<div class="discovery-search">
					<search-input id="searchQuery" label="Search"></search-input>
					<template is="dom-repeat" items="[[_entitiesResult]]">
						<d2l-activity-list-item href="#" entity=[[item]]></d2l-activity-list-item>
					</template>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			_entitiesResult: {
				type: Array,
				value: function() { return []; }
			}
		};
	}
	ready() {
		super.ready();
		this.$.searchQuery.addEventListener('d2l-input-search-searched', this._onD2lInputSearchSearched.bind(this));
	}
	_onD2lInputSearchSearched(e) {
		this._getSearchActionUrl(e.detail.value)
			.then(this._fetchEntity.bind(this))
			.then(this._handleSearchResponse.bind(this));
	}

	_handleSearchResponse(sirenEntity) {
		const entities = sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com');
		this._entitiesResult = entities;
	}

	_getSearchActionUrl(searchParam) {
		const bffEndpoint = this.fraSetup && this.fraSetup.options && this.fraSetup.options.endpoint;
		if (!bffEndpoint) {
			return Promise.reject('BFF end point does not exist');
		}
		return this._fetchEntity(bffEndpoint)
			.then((response) => {
				const searchAction = response.hasAction('search-activities') && response.getAction('search-activities');
				if (!searchAction) {
					return Promise.reject('BFF end point does not exist');
				}
				const defaultParams = searchAction.fields.reduce((defaults, field) => {
					defaults[field.name] = field.value;
					return defaults;
				}, {});
				const userParams = {
					q: searchParam
				};
				return this._createActionUrl(searchAction.href, defaultParams, userParams);
			});
	}

	_createActionUrl(href, defaultParams, userParams) {
		const query = Object.assign({}, defaultParams, userParams);

		const queryString = Object.keys(query).map((key) => {
			return key + '=' + encodeURI(query[key]);
		}).join('&');

		let url = href;
		if (queryString) {
			const connectChar = href.indexOf('?') > -1 ? '&' : '?';
			url += connectChar + queryString;
		}
		return url;
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
