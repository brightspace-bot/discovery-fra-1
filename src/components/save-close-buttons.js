'use strict';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import '@brightspace-ui/core/components/button/floating-buttons.js';
import '@brightspace-ui/core/components/button/button.js';

class SaveCloseButtons extends LitElement {
	render() {
		return html`
			<d2l-floating-buttons>
				<d2l-button
					class="page-save-button"
					@click="${this._pageSave}"
					primary>Save</d2l-button>
				<d2l-button
					class="page-cancel-button"
					@click="${this._pageCancel}">Cancel</d2l-button>
			</d2l-floating-buttons>
		`;
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
