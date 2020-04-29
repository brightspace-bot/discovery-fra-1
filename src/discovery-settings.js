'use strict';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import './components/discovery-footer.js';
import './components/home-header.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

class DiscoverySettings extends RouteLocationsMixin(LitElement) {
	render() {
		return html`
			<style include="discovery-styles"></style>
			<div class="discovery-settings-main">
				<div class="discovery-settings-home-header">
					<home-header query="" .showSettingsButton="${this.promotedCoursesEnabled}"></home-header>
				</div>
				<discovery-footer></discovery-footer>
			</div>
		`;
	}

	static get styles() {
		return [
			heading2Styles,
			bodyCompactStyles,
			bodyStandardStyles,
			css`
				:host {
					display: block;
					margin: 0 auto;
					max-width: 1230px;
				}
				.discovery-settings-home-header {
					margin-bottom: 1rem;
				}
				.discovery-settings-main {
					margin: 0 30px;
				}
				@media only screen and (max-width: 929px) {
					.discovery-settings-main {
						margin: 0 24px;
					}
				}
				@media only screen and (max-width: 767px) {
					.discovery-settings-main {
						margin: 0 18px;
					}
				}
			`
		];
	}

	constructor() {
		super();
		this.promotedCoursesEnabled = false;
	}

	static get properties() {
		return {
			visible: {
				type: Boolean
			},
			promotedCoursesEnabled: {
				type: Boolean
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	updated() {
		setTimeout(this._checkPermission.bind(this), 500);
	}

	_checkPermission() {
		if (!this.visible || this.promotedCoursesEnabled) {
			return;
		}

		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().notFound()
			},
			bubbles: true,
			composed: true
		}));
	}
}

window.customElements.define('discovery-settings', DiscoverySettings);
