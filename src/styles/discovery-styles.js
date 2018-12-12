import '@polymer/polymer/polymer-element.js';
import 'd2l-typography/d2l-typography.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="discovery-styles">
	<template>
		<style include="d2l-typography"></style>
		<style>
			/* shared styles */
		</style>
  	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
