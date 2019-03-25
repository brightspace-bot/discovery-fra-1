'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import 'd2l-link/d2l-link.js';

class DiscoveryFooter extends LocalizeMixin(PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
					height: 150px;
				}
				.discovery-footer-feedback-email {
					padding-top: 15px;
					padding-bottom: 10px;
					text-align: right;
				}
			</style>
			<footer>
				<div class="discovery-footer-feedback-email">
					<d2l-link href="mailto:self-enroll-pilot@d2lmail.onmicrosoft.com">
						[[localize('emailFeedback', 'email', 'self-enroll-pilot@d2lmail.onmicrosoft.com')]]
					</d2l-link>
				</div>
			</footer>
		`;
	}
	static get properties() {
		return {};
	}
}

window.customElements.define('discovery-footer', DiscoveryFooter);
