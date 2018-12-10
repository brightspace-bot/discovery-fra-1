'use strict';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier2-icons.js';

import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';

class SearchResultEntry extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html`
			<style>
				:host {
					display: inline;
				}

				.discovery-search-result-entry-container {
					background-color: lightgrey;
					border-radius: 5px;
					cursor: pointer;
					display: flex;
					height: 160px;
					min-width: 860px;
					overflow: hidden;
				}

				.discovery-search-result-entry-detail {
					margin: 1rem;
					min-width: 300px;
					overflow: hidden;
					visibility: hidden;
				}

				.discovery-search-result-entry-tags {
					margin-left: 5%;
				}

				.discovery-search-result-entry-thumbnail {
					flex-shrink: 0;
					height: 100%;
					width: 340px;
				}
			</style>
			<div class="discovery-search-result-entry-container" on-click="_navigateToCourse">
				<img class="discovery-search-result-entry-thumbnail" src="[[courseThumbnailLink]]">
				<div class="discovery-search-result-entry-detail">
					<p class="d2l-label-text">[[processedTitle]]</p>
					<p class="d2l-body-small">[[processedDescription]]</p>
					<p>
						<d2l-icon icon="d2l-tier2:time"></d2l-icon>
						<span class="d2l-body-small">[[courseDuration]] [[localize('minutes')]]</span>

						<span class="discovery-search-result-entry-tags">
							<template is="dom-if" if="[[hasTags]]">
								<d2l-icon icon="d2l-tier2:tag"></d2l-icon>
								<span class="d2l-body-small">[[listOfTagsAsString]]</span>
							</template>
						</span>
					</p>
				</div>
			</div>
		`;
	}
	static get properties() {
		return {
			titleMaxLength: {
				type: Number,
				readOnly: true,
				value: 50
			},
			descriptionMaxLength: {
				type: Number,
				readOnly: true,
				value: 100
			},
			courseId: Number,
			courseTitle: String,
			courseDescription: String,
			courseThumbnailLink: String,
			courseDuration: Number,
			courseTags: Array,

			processedTitle: {
				type: String,
				computed: '_computeProcessedTitle(courseTitle)'
			},
			processedDescription: {
				type: String,
				computed: '_computeProcessedDescription(courseDescription)'
			},
			hasTags: {
				type: Boolean,
				computed: '_computeHasTags(courseTags)'
			},
			listOfTagsAsString: {
				type: String,
				computed: '_computeListOfTagsAsString(courseTags)'
			}
		};
	}
	_computeHasTags(courseTags) {
		return courseTags && courseTags.length > 0;
	}

	_computeListOfTagsAsString(courseTags) {
		return courseTags && courseTags.join(', ');
	}

	_computeProcessedTitle(courseTitle) {
		if (courseTitle && courseTitle.length > this.titleMaxLength) {
			return courseTitle.substring(0, this.titleMaxLength) + '...';
		}
		return courseTitle;
	}
	_computeProcessedDescription(courseDescription) {
		if (courseDescription && courseDescription.length > this.descriptionMaxLength) {
			return courseDescription.substring(0, this.descriptionMaxLength) + '...';
		}
		return courseDescription;
	}
	_navigateToCourse() {
		if (this.courseId) {
			this.dispatchEvent(new CustomEvent('navigate', {
				detail: {
					path: this.routeLocations().course(this.courseId)
				},
				bubbles: true,
				composed: true
			}));
		}
	}
}

window.customElements.define('search-result-entry', SearchResultEntry);
