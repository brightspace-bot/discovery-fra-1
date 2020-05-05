'use strict';
import { html, LitElement } from 'lit-element/lit-element.js';
import '@brightspace-ui/core/components/button/floating-buttons.js';
import '@brightspace-ui/core/components/button/button.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from '../localization.js';

class SaveCloseButtons extends LocalizeMixin(LitElement) {
	render() {
		return html`
			<d2l-floating-buttons>
				<d2l-button
					class="page-save-button"
					@click="${this._pageSave}"
					primary>${this.localize('save')}</d2l-button>
				<d2l-button
					class="page-cancel-button"
					@click="${this._pageCancel}">${this.localize('cancel')}</d2l-button>
			</d2l-floating-buttons>
		`;
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	_pageSave() {
		this.dispatchEvent(new CustomEvent('discover-page-save', {
			bubbles: true,
			composed: true
		}));
	}

	_pageCancel() {
		this.dispatchEvent(new CustomEvent('discover-page-cancel', {
			bubbles: true,
			composed: true
		}));
	}
}

window.customElements.define('save-close-buttons', SaveCloseButtons);
