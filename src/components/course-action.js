import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';
import 'd2l-typography/d2l-typography.js';

import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseAction extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html `
			<style include="d2l-typography">
				:host {
					display: flex;
					width: 100%;
				}

				.discovery-course-action-container {
					width: 100%;
				}

				.discovery-course-action-thumbnail {
					border-radius: 5px;
					height: 190px;
					padding-bottom: 1rem;
					width: 100%;
				}

				.discovery-course-action-details-container {
					display: flex;
					flex-direction: row;
					width: 100%;
				}

				.discovery-course-action-duration {
					margin-left: 1.5rem;
					margin-right: 1.5rem;
					width: 50%;
				}

				.discovery-course-action-last-updated {
					margin-left: 2rem;
					margin-right: 2rem;
					width: 50%;
				}

				.discovery-course-action-tags-container {
					display: flex;
					flex-direction: column;
					margin: 1.5rem;
				}
			</style>

			<div class="discovery-course-action-container d2l-typography">
				<img class="discovery-course-action-thumbnail" src="[[courseThumbnailLink]]">

				<div class="discovery-course-action-details-container">
					<div class="discovery-course-action-duration">
						<div class="d2l-label-text">[[localize('duration')]]</div>
						<div class="d2l-body-standard">[[courseDuration]] [[localize('minutes')]]</div>
					</div>

					<div class="discovery-course-action-last-updated">
						<div class="d2l-label-text">[[localize('lastUpdated')]]</div>
						<div class="d2l-body-standard">[[courseLastUpdated]]</div>
					</div>
				</div>

				<template is="dom-if" if="[[tagsExist]]">
					<div class="discovery-course-action-tags-container">
						<span class="d2l-label-text">[[localize('taggedWith')]]</span>
						<div>
							<template is="dom-repeat" items="[[courseTags]]">
								<d2l-link href="javascript:void(0)" on-click="_navigateToSearch">
									<span value="[[item]]">[[item]][[_getTagSuffix(index)]]</span>
								</d2l-link>
							</template>
						</div>
					</div>
				</template>

			</div>
		`;
	}

	static get properties() {
		return {
			courseTitle: String,
			courseThumbnailLink: String,
			courseDuration: Number,
			courseLastUpdated: String,
			courseTags: Array,
			tagsExist: {
				type: Boolean,
				computed: '_tagsExist(courseTags)',
			},
		};
	}

	_tagsExist(courseTags) {
		return courseTags && courseTags.length;
	}

	_getTagSuffix(index) {
		if (index !== undefined && this.courseTags) {
			if (index === this.courseTags.length - 1) {
				return '';
			} else {
				return ', ';
			}
		}
		return '';
	}

	_navigateToSearch(e) {
		if (e && e.target && e.target.value) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().search(e.target.value),
				},
				bubbles: true,
				composed: true,
			}));
		}
	}
}

window.customElements.define('course-action', CourseAction);
