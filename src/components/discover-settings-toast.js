'use strict';
import '@brightspace-ui/core/components/alert/alert-toast.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { getLocalizeResources } from '../localization.js';

class DiscoverSettingsToast extends LocalizeMixin(LitElement) {

	render() {
		return html`
			<d2l-alert-toast type="success"></d2l-alert-toast>
		`;
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	save() {
		this.shadowRoot.querySelector('d2l-alert-toast').innerHTML = this.localize('saveCompleted');
		this.shadowRoot.querySelector('d2l-alert-toast').open = true;
	}

	cancel() {
		this.shadowRoot.querySelector('d2l-alert-toast').innerHTML = this.localize('saveCancelled');
		this.shadowRoot.querySelector('d2l-alert-toast').open = true;
	}
}

window.customElements.define('discover-settings-toast', DiscoverSettingsToast);
