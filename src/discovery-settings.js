'use strict';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import './components/home-header.js';
import './components/save-close-buttons.js';
import { RouteLocationsMixin } from './mixins/route-locations-mixin.js';

class DiscoverySettings extends RouteLocationsMixin(LitElement) {
	render() {
		return html`
			<style include="discovery-styles"></style>
			<div class="discovery-settings-main">
				<div class="discovery-settings-header">
					<home-header query="" .showSettingsButton="${this.promotedCoursesEnabled}"></home-header>
				</div>
				<div class="discovery-settings-content"></div>
				<div class="discovery-settings-page-divider"></div>
				<save-close-buttons></save-close-buttons>
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
				.discovery-settings-header {
					margin-bottom: 1rem;
				}
				.discovery-settings-main {
					margin: 0 30px;
				}
				.discovery-settings-content {
					min-height: 400px;
				}
				.discovery-settings-page-divider {
					border-top: 1px solid rgba(124,134,149,0.18);
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
		this.addEventListener('discover-page-save', this._handleSave.bind(this));
		this.addEventListener('discover-page-cancel', this._handleCancel.bind(this));
	}

	disconnectedCallback() {
		this.addEventListener('discover-page-save', this._handleSave.bind(this));
		this.addEventListener('discover-page-cancel', this._handleCancel.bind(this));
		super.disconnectedCallback();
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'promotedCoursesEnabled' || propName === 'visible') {
				this._checkPermission();
			}
		});
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

	_handleSave() {
	}

	_handleCancel() {
	}
}

window.customElements.define('discovery-settings', DiscoverySettings);
