import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {SearchInput} from './components/search-input.js';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-fetch-auth/d2l-fetch-auth-framed.js';
import {D2lActivityListItem} from 'd2l-activities/components/d2l-activity-list-item/d2l-activity-list-item.js';

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
		const searchParam = encodeURI(e.detail.value);
		const searchUrl = `https://us-east-1.discovery.bff.dev.brightspace.com/search?q=${searchParam}`;
		this._fetchEntity(searchUrl)
			.then(this._handleSearchResponse.bind(this));
	}

	_handleSearchResponse(sirenEntity) {
		const entities = sirenEntity.getSubEntitiesByRel('https://discovery.brightspace.com');
		this._entitiesResult = entities;
	}

	getToken() {
		const scope = ['*:*:*'];
		const client = window.D2L.frau.client;
		return client.request('frau-jwt-new-jwt', scope);
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
