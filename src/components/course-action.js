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
					display: inline;
				}

				.discovery-course-action-container {
					display: flex;
					flex-direction: column;
					margin: 1.5rem 1.5rem 2.4rem;
				}

				.discovery-course-action-d2l-heading-3 {
					margin-bottom: 0.9rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-action-description-list {
					margin: 0;
				}

				.discovery-course-action-description-list-row {
					display: flex;
					margin-bottom: 0.6rem;
				}

				.discovery-course-action-description-list-gutter {
					flex-grow: 1;
					max-width: 1.5rem;
					min-width: 0.5rem;
				}

				.discovery-course-action-description-list-term {
					color: var(--d2l-color-tungsten);
					flex: 0 1 6rem;
					margin: 0;
				}

				.discovery-course-action-description-list-data {
					color: var(--d2l-color-ferrite);
					flex: 0 1 6rem;
					margin: 0;
				}

				.discovery-course-action-tags-container {
					display: flex;
					flex-direction: column;
					margin-top: 1.5rem;
				}

				@media only screen and (max-width: 615px) {
					.discovery-course-action-container {
						margin: 1.2rem 0.9rem 1.8rem;
					}
				}
			</style>

			<div class="d2l-typography discovery-course-action-container">
				<h3 class="d2l-heading-3 discovery-course-action-d2l-heading-3">[[localize('courseInfo')]]</h3>

				<dl class="discovery-course-action-description-list">
					<div class="discovery-course-action-description-list-row">
						<dt class="d2l-body-compact discovery-course-action-description-list-term">[[localize('startDate')]]</dt>
						<div class="discovery-course-action-description-list-gutter"></div>
						<dd class="d2l-body-compact discovery-course-action-description-list-data">[[startDate]]</dd>
					</div>

					<div class="discovery-course-action-description-list-row">
						<dt class="d2l-body-compact discovery-course-action-description-list-term">[[localize('endDate')]]</dt>
						<div class="discovery-course-action-description-list-gutter"></div>
						<dd class="d2l-body-compact discovery-course-action-description-list-data">[[endDate]]</dd>
					</div>

					<div class="discovery-course-action-description-list-row">
						<dt class="d2l-body-compact discovery-course-action-description-list-term">[[localize('courseCode')]]</dt>
						<div class="discovery-course-action-description-list-gutter"></div>
						<dd class="d2l-body-compact discovery-course-action-description-list-data">[[courseCode]]</dd>
					</div>

					<div class="discovery-course-action-description-list-row">
						<dt class="d2l-body-compact discovery-course-action-description-list-term">[[localize('firstPublished')]]</dt>
						<div class="discovery-course-action-description-list-gutter"></div>
						<dd class="d2l-body-compact discovery-course-action-description-list-data">[[firstPublished]]</dd>
					</div>
				</dl>

				<template is="dom-if" if="[[tagsExist]]">
					<div class="discovery-course-action-tags-container">
						<h3 class="d2l-heading-3 discovery-course-action-d2l-heading-3">[[localize('searchKeywords')]]</h3>
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
			courseCode: String,
			courseTags: Array,
			endDate: String,
			firstPublished: String,
			startDate: String,
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
