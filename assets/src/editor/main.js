
import Editor from './editor';
import ArgsMeta from './meta/arguments';
import ActionsMeta from './meta/actions';
import PresetMeta from './meta/preset';
import MessagesMeta from './meta/messages';
import Captcha from "./meta/captcha";
import Gateways from "./meta/gateways";

import './form-actions/send-email';
import './form-actions/insert-post';
import './form-actions/register-user';
import './form-actions/update-user';
import './form-actions/update-options';
import './form-actions/call-hook';
import './form-actions/call-webhook';
import './form-actions/redirect-to-page';
import './form-actions/mailchimp';
import './form-actions/getresponse';
import './form-actions/activecampaign';
import { event } from "./helpers/tools";


window.jetFormBuilderControls = {
	toolbar: {},
	general: {},
	advanced: {},
};
import './blocks/blocks-manager';

event( 'jet-form-builder-initialize' )();


window.jetFormActionTypes.forEach( function ( action, index ) {
	if ( window.jetFormDefaultActions && window.jetFormDefaultActions[ action.id ] ) {
		window.jetFormActionTypes[ index ].callback = window.jetFormDefaultActions[ action.id ];
	}
} );

ArgsMeta();
Captcha();
Gateways();
ActionsMeta();
PresetMeta();
MessagesMeta();

event('jet-form-builder-initialized')();

/**
 * Takes a target input element via ID and turns it into a block editor
 *
 * @param  {string} id        The html ID of the input to be transformed
 * @param  {string} inputName The input name to use for when the form gets submitted
 * @param  {string} content   Starting content to fill the editor with, leave blank to use the value of the target element
 * @param formName
 * @return {void}             This function returns no values
 */
window.JetFormEditor = function ( id, inputName, content, formName ) {

	// find our element and swap it out for a div container
	const original = document.getElementById( id );

	// make the content and inputName parameters optional
	if ( typeof content === 'undefined' ) {
		content = original.value;
	}
	if ( typeof inputName === 'undefined' ) {
		inputName = original.name;
	}

	// Now we can create and swap out the element, this is to give React a nice div node to work with
	const element = document.createElement( 'div' );

	element.setAttribute(
		'class',
		'jet-form-builder block-editor gutenberg__editor block-editor__container wp-embed-responsive'
	);

	element.setAttribute( 'id', id );
	original.replaceWith( element );

	// tada!
	ReactDOM.render(
		<Editor startingContent={ content } inputName={ inputName } formName={ formName }/>,
		element
	);

}

