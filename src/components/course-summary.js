import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LocalizeMixin } from '../mixins/localize-mixin.js';
import { RouteLocationsMixin } from '../mixins/route-locations-mixin.js';

import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-link/d2l-link.js';

class CourseSummary extends LocalizeMixin(RouteLocationsMixin(PolymerElement)) {
	static get template() {
		return html `
			<style include="d2l-typography"></style>
			<style>
				:host {
					display: inline;
				}

				.container {
					display: flex;
					flex-direction: column;
					overflow: hidden;
					padding: 1rem;
				}

				.breadcrumbs {
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				.breadcrumbs>* {
					margin: 2px;
				}

				.title {
					margin-top: 0.5rem;
				}

				.d2l-heading-1 {
					margin-top: 0 !important;
				}

				.d2l-heading-4 {
					margin-top: 0 !important;
					margin-bottom: 1rem !important;
				}

				.keyOutcomes {
					margin-bottom: 1rem;
				}

				.keyOutcomes ul{
					list-style-type: disc;
					-webkit-columns: 2;
					-moz-columns: 2;
					columns: 2;
					list-style-position: inside;
					-webkit-column-gap: 3rem;
					-moz-column-gap: 3rem;
					column-gap: 3rem;

					padding: 0;
					margin-left: 0.5rem;
					margin-top: 0;
					width: 100%;
				}

				.textStuff {
					white-space: pre-wrap;
				}
			</style>

			<div class="d2l-typography">
				<div class="container">
					<div class="breadcrumbs">
						<d2l-link href="javascript:void(0)" on-click="_navigateToHome">[[localize('discover')]]</d2l-link>
						<d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>
						<d2l-link href="javascript:void(0)" on-click="_navigateToSearch">
							<span value="[[courseCategory]]">[[courseCategory]]</span>
						</d2l-link>
						<d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>
					</div>

					<div class="title">
						<h1 class="d2l-heading-1">[[courseTitle]]</h1>
					</div>

					<div class="keyOutcomes">
						<h4 class="d2l-heading-4">[[localize('keyOutcomes')]]</h4>
						<div class="d2l-body-compact">
							<ul class="keyOutcomes">
								<template is="dom-repeat" items="[[courseKeyOutcomes]]">
									<li>[[item]]</li>
								</template>
							</ul>
						</div>
					</div>

					<div class="description">
						<h4 class="d2l-heading-4">[[localize('courseDescription')]]</h4>
						<div class="d2l-body-compact textStuff">[[courseDescription]]</div>
					</div>
				</div>
			</div>
		`;
	}

	static get is() {
		return 'course-summary';
	}

	static get properties() {
		return {
			courseCategory: String,
			courseTitle: String,
			courseKeyOutcomes: Array,
			courseDescription: String,
		};
	}

	_navigateToHome() {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: {
				path: this.routeLocations().home(),
			},
			bubbles: true,
			composed: true,
		}));
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

window.customElements.define(CourseSummary.is, CourseSummary);
