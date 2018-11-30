import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {SearchInput} from './components/search-input.js';
import { d2lfetch } from 'd2l-fetch/src/index.js';

/**
 * @customElement
 * @polymer
 */
class DiscoveryApp extends PolymerElement {
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
		d2lfetch.fetch(new Request('https://us-east-1.discovery.bff.dev.brightspace.com/search?q='+e.detail.value))
		.then(response => response.text())
		.then(text => this.result = text)
		.catch(error => this.result = 'Error: '+error);
	}
}

window.customElements.define('discovery-app', DiscoveryApp);
