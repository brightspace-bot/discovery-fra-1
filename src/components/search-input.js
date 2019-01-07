import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import 'fastdom/fastdom.min.js';
import 'd2l-polymer-behaviors/d2l-focusable-behavior.js';
import './d2l-input-style.js';
/**
 * @customElement
 * @polymer
 */
class SearchInput extends mixinBehaviors([D2L.PolymerBehaviors.FocusableBehavior], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-input-styles">
				:host {
					display: inline-block;
					position: relative;
					width: 100%
				}
				input[type="text"].d2l-input {
					font-family: inherit;
					padding-right: 2.4rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				:host-context([dir="rtl"]) input[type="text"].d2l-input {
					padding-right: 0.75rem;
					padding-left: 2.4rem;
				}
				/* Duplicated because some browsers ignore CSS block for any invalid selector */
				:host(:dir(rtl)) input[type="text"].d2l-input {
					padding-right: 0.75rem;
					padding-left: 2.4rem;
				}
				.d2l-input-search-hover input[type="text"].d2l-input,
				.d2l-input-search-focus input[type="text"].d2l-input{
					@apply --d2l-input-hover-focus;
					padding-right: calc(2.4rem - 1px);
				}
				:host-context([dir="rtl"]) input[type="text"].d2l-input:hover,
				:host-context([dir="rtl"]) input[type="text"].d2l-input:focus,
				:host-context([dir="rtl"]) .d2l-input-search-hover input[type="text"].d2l-input,
				:host-context([dir="rtl"]) .d2l-input-search-focus input[type="text"].d2l-input {
					padding-right: calc(0.75rem - 1px);
					padding-left: calc(2.4rem - 1px);
				}
				:host(:dir(rtl)) input[type="text"].d2l-input:hover,
				:host(:dir(rtl)) input[type="text"].d2l-input:focus,
				:host(:dir(rtl)) .d2l-input-search-hover input[type="text"].d2l-input,
				:host(:dir(rtl)) .d2l-input-search-focus input[type="text"].d2l-input {
					padding-right: calc(0.75rem - 1px);
					padding-left: calc(2.4rem - 1px);
				}
			</style>
			<div class="d2l-input-search-container">
				<input
					aria-label$="[[label]]"
					class="d2l-input d2l-focusable"
					disabled$="[[disabled]]"
					maxlength$="[[maxlength]]"
					on-keypress="_handleInputKeyPress"
					on-input="_handleInput"
					placeholder$="[[placeholder]]"
					type="text"
					value="[[value]]" />
			</div>
		`;
	}
	static get properties() {
		return {
			/**
			 * Whether the input is disabled.
			 */
			disabled: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			/**
			 * Accessible label to be applied to the input.
			 */
			label: {
				type: String
			},
			/**
			 * Maximum number of characters that the user can enter.
			 */
			maxlength: {
				type: Number
			},
			/**
			 * When true, the clear button will not be displayed when a search is performed.
			 */
			noClear: {
				type: Boolean
			},
			/**
			 * A hint to the user of what can be entered in the input.
			 */
			placeholder: {
				type: String
			},
			/**
			 * Value of the input.
			 */
			value: {
				type: String,
				notify: true,
				value: ''
			},
			/**
			 * Value of the input the last time a search was performed.
			 */
			lastSearchValue: {
				type: String,
				readOnly: true,
				value: ''
			},
			_showSearch: {
				type: Boolean,
				computed: '_computeShowSearch(lastSearchValue, value)'
			}
		};
	}
	get hostAttributes() {
		return {'role': 'search'};
	}
	get _keyCodes() {
		return { ENTER: 13 };
	}

	/**
	 * Performs a search.
	 */
	search() {
		var noClear = (this.noClear === true);
		this._setLastSearchValue(this.value);
		this._dispatchEvent();
		window.fastdom.mutate(function() {
			if (!noClear && this.value.length > 0) {
				Polymer.dom(this.root).querySelector('.d2l-input-search-clear').focus();
			}
		}.bind(this));
	}

	_computeShowSearch(lastSearchValue, value) {
		var noClear = (this.noClear === true);
		var valueIsEmpty = (value === undefined || value === null || value === '');
		var lastSearchValueIsEmpty = (lastSearchValue === undefined || lastSearchValue === null || lastSearchValue === '');
		var showSearch = (valueIsEmpty && lastSearchValueIsEmpty) ||
			(lastSearchValue !== value) || noClear;
		return showSearch;
	}
	_dispatchEvent() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-search-searched',
			{bubbles: true, composed: false, detail: {value: this.value}}
		));
	}
	_getContainer() {
		return Polymer.dom(this.root).querySelector('.d2l-input-search-container');
	}
	_handleBlur(e) {
		if (this._isFocusableChild(e.relatedTarget)) return;
		window.fastdom.mutate(function() {
			this._getContainer().classList.remove('d2l-input-search-focus');
		}.bind(this));
	}
	_handleClearClick() {
		this.value = '';
		if (this.value !== this.lastSearchValue) {
			this._setLastSearchValue('');
			this._dispatchEvent();
		}
		window.fastdom.mutate(function() {
			var input = Polymer.dom(this.root).querySelector('input');
			input.focus();
		}.bind(this));
	}
	_handleFocus() {
		window.fastdom.mutate(function() {
			this._getContainer().classList.add('d2l-input-search-focus');
		}.bind(this));
	}
	_handleInputKeyPress(e) {
		if (e.keyCode !== this._keyCodes.ENTER) {
			return;
		}
		e.preventDefault();
		this._setLastSearchValue(this.value);
		this._dispatchEvent();
	}
	_handleInput(e) {
		this.value = e.target.value;
	}
	_handleMouseEnter() {
		window.fastdom.mutate(function() {
			this._getContainer().classList.add('d2l-input-search-hover');
		}.bind(this));
	}
	_handleMouseLeave(e) {
		if (this._isFocusableChild(e.relatedTarget)) return;
		window.fastdom.mutate(function() {
			this._getContainer().classList.remove('d2l-input-search-hover');
		}.bind(this));
	}
	_isFocusableChild(elem) {
		return (elem === Polymer.dom(this.root).querySelector('input')
			|| elem === Polymer.dom(this.root).querySelector('.d2l-input-search-search')
			|| elem === Polymer.dom(this.root).querySelector('.d2l-input-search-clear'));
	}
}

window.customElements.define('search-input', SearchInput);
