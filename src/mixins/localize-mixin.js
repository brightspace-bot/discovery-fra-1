'use strict';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';

import '../locales/locales.js';

/* @polymerMixin */
const internalLocalizeMixin = (superClass) =>
	class extends mixinBehaviors([D2L.PolymerBehaviors.LocalizeBehavior], superClass) {
		constructor() {
			super();
		}

		static get properties() {
			return {
				language: {
					type: String,
					computed: '_determineLanguage(locale, resources)'
				},
				locale: {
					type: String,
					value: () => {
						var langTag = document.documentElement.lang ||
							document.documentElement.getAttribute('data-lang-default') ||
							'en-us';
						langTag = langTag.trim().toLowerCase();
						var subtags = langTag.split('-');
						if (subtags.length < 2) {
							return langTag;
						}
						var langSubtag = subtags[0];
						var regionSubtag = subtags[subtags.length - 1].toUpperCase();
						return langSubtag + '-' + regionSubtag;
					}
				},
				resources: {
					value: () => {
						return D2L.Discovery.Locales;
					},
				},
			};
		}

		_determineLanguage(locale, resources) {
			locale = locale.toLowerCase();
			if (resources[locale]) {
				return locale;
			}
			var langAndRegion = locale.split('-');
			if (resources[langAndRegion[0]]) {
				return langAndRegion[0];
			}
			return 'en';
		}
	};

export const LocalizeMixin = dedupingMixin(internalLocalizeMixin);
