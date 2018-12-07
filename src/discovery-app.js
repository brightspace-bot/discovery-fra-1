import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {SearchInput} from './components/search-input.js';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import { d2lfetch } from 'd2l-fetch/src/index.js';

/**
 * @customElement
 * @polymer
 */
class DiscoveryApp extends mixinBehaviors([D2L.PolymerBehaviors.FetchSirenEntityBehavior], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
				.discovery-flex-container {
					display: flex;
				}
			</style>
			<h2>Discovery</h2>
			<div class="discovery-flex-container">
				<img src="images/disco-self.png" />
				<div class="search">
					<search-input id="searchQuery" label="Search"></search-input>
					<div>[[result]]</div>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			result: {
				type: String,
				value: ''
			}
		};
	}
	ready() {
		super.ready();
		this.$.searchQuery.addEventListener('d2l-input-search-searched', this._onD2lInputSearchSearched.bind(this));
	}
	_onD2lInputSearchSearched(e) {
		const searchUrl = 'https://us-east-1.discovery.bff.dev.brightspace.com/search?q=';
		let uri = encodeURI(searchUrl+e.detail.value)
		this._fetchEntityWithToken(uri, this.getToken.bind(this))
			.then(this._handleSearchResponse.bind(this));
	}

	_handleSearchResponse(sirenEntity) {
		this._result = sirenEntity;
		console.log(sirenEntity);
	}

	getToken() {
		const scope = ['*:*:*'];
		const client = window.D2L.frau.client;
		return client.request('frau-jwt-new-jwt', scope);
	  }
}

window.customElements.define('discovery-app', DiscoveryApp);
