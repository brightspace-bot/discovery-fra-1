import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import 'd2l-alert/d2l-alert-toast.js';
import 'd2l-button/d2l-button.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';

import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

class CourseAction extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html `
			<style>
				:host {
					display: inline;
				}

				.discovery-course-action-thumbnail {
					border-radius: 5px;
					height: 190px;
					padding-bottom: 1rem;
					width: 100%;
				}

				.discovery-course-action-container {
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

				.discovery-course-action-buttons-container {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					margin-bottom: 1.5rem;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
				}

				.discovery-course-action-alert {
					height: auto;
					width: 415px;
				}

				.discovery-course-action-alert-container {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					overflow: auto;
				}

				.discovery-course-action-alert-content {
					margin-left: 0.5rem;
					margin-right: 0.5rem;
				}

				.discovery-course-action-dialog {
					border-radius: 5px;
					overflow: auto;
					width: 45%;
				}

				.discovery-course-action-dialog-container {
					display: flex;
					flex-direction: column;
				}

				.discovery-course-action-dialog-header-container {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}

				.discovery-course-action-dialog-close {
					cursor: pointer;
					font-size: 28px;
				}

				.discovery-course-action-d2l-heading-4 {
					margin-bottom: 0.8rem !important;
					margin-top: 0 !important;
				}

				.discovery-course-action-d2l-heading-2 {
					margin-bottom: 0.7rem !important;
					margin-top: 0 !important;
					white-space: normal;
				}

				.discovery-course-action-dialog-button-container {
					display: flex;
					flex-direction: row;
					margin-top: 2rem;
					overflow: auto;
				}

				.discovery-course-action-second-dialog-button {
					margin-left: 1rem;
				}
			</style>

			<img class="discovery-course-action-thumbnail" src="[[courseThumbnailLink]]">

			<div class="discovery-course-action-container">
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

			<div class="discovery-course-action-buttons-container">
				<div>
					<template is="dom-if" if="[[isInMyLearning]]">
						<d2l-button on-click="_addToMyLearning" primary>[[localize('accessMaterials')]]</d2l-button>
					</template>
					<template is="dom-if" if="[[!isInMyLearning]]">
						<d2l-button on-click="_addToMyLearning" primary>[[localize('addToMyLearning')]]</d2l-button>
					</template>
				</div>
				<div>
					<template is="dom-if" if="[[isInMyLearning]]">
						<d2l-button on-click="_addToMyList">[[localize('unenroll')]]</d2l-button>
					</template>
					<template is="dom-if" if="[[!isInMyLearning]]">
						<template is="dom-if" if="[[isOnMyList]]">
							<d2l-button on-click="_addToMyList">[[localize('onMyList')]]</d2l-button>
						</template>
						<template is="dom-if" if="[[!isOnMyList]]">
							<d2l-button on-click="_addToMyList">[[localize('addToMyList')]]</d2l-button>
						</template>
					</template>
				</div>
			</div>

			<d2l-alert-toast class="discovery-course-action-alert" id="addedAlert" type="success" hide-close-button>
				<div class="discovery-course-action-alert-container">
					<div class="discovery-course-action-alert-content">[[localize('addedToYourList')]]</div>
					<div class="discovery-course-action-alert-content">
						<d2l-link href="javascript:void(0)" on-click="_navigateToMyList">[[localize('viewMyList')]]</d2l-link>
					</div>
				</div>
			</d2l-alert-toast>

			<paper-dialog class="discovery-course-action-dialog d2l-typography" id="myLearningDialog" always-on-top with-backdrop>
				<div class="discovery-course-action-dialog-container">
					<div class="discovery-course-action-dialog-header-container">
						<h4 class="d2l-heading-4 discovery-course-action-d2l-heading-4">[[localize('addedToMyLearningHeader')]]</h4>
						<d2l-icon class="discovery-course-action-dialog-close" on-click="_closeDialog" icon="d2l-tier1:close-small"></d2l-icon>
					</div>

					<h2 class="d2l-heading-2 discovery-course-action-d2l-heading-2">[[courseTitle]]</h2>
					<h4 class="d2l-heading-4 discovery-course-action-d2l-heading-4">[[localize('welcomeToTheCourse')]]</h4>
					<span class="d2l-body-standard">
						[[localize('addedToMyLearningMessage')]]
					</span>
					<div class="discovery-course-action-dialog-button-container">
						<div>
							<d2l-button on-click="_navigateToHome" primary>[[localize('startLearning')]]</d2l-button>
						</div>
						<div class="discovery-course-action-second-dialog-button">
							<d2l-button on-click="_closeDialog">[[localize('continueBrowsing')]]</d2l-button>
						</div>
					</div>
				</div>
			</paper-dialog>
		`;
	}

	static get is() {
		return 'course-action';
	}

	static get properties() {
		return {
			courseTitle: String,
			courseThumbnailLink: String,
			courseDuration: Number,
			courseLastUpdated: String,
			courseTags: Array,
			isInMyLearning: {
				type: Boolean,
				notify: true
			},
			isOnMyList: {
				type: Boolean,
				notify: true
			},

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

	_addToMyLearning() {
		this.isInMyLearning = !this.isInMyLearning; // temporary toggle functionality for testing

		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = true;
	}

	_closeDialog() {
		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = false;
	}

	_addToMyList() {
		this.isOnMyList = !this.isOnMyList; // temporary toggle functionality for testing

		var addedAlert = this.shadowRoot.querySelector('#addedAlert');
		addedAlert.open = true;
	}

	_navigateToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().home(),
			},
			bubbles: true,
			composed: true,
		}));

		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = false;
	}

	_navigateToMyList() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().myList(),
			},
			bubbles: true,
			composed: true,
		}));

		var myLearningDialog = this.shadowRoot.querySelector('#myLearningDialog');
		myLearningDialog.opened = false;
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

window.customElements.define(CourseAction.is, CourseAction);
