import BlockInstance from "./block-instance";
import BlocksStore from "./blocks-store";

const blocks = [
	'hidden-field',
	'repeater-field',
	'text-field',
	'datetime-field',
	'submit-field',
	'range-field',
	'textarea-field',
	'heading-field',
	'wysiwyg-field',
	'media-field',
	'time-field',
	'date-field',
	'number-field',
	'checkbox-field',
	'radio-field',
	'select-field',
	'form-break-field',
	'group-break-field',
	'conditional-block',
	'calculated-field',
];

const setupBlocks = () => {

	blocks.forEach( blockName => {
		const blockData = require( `./${ blockName }/block.json` );

		const blockUI = {
			save: () => null,
			edit: false,
			editField: false,
			editToolbar: false,
			editGeneral: false,
			editAdvanced: false,
		};

		const partNames = [
			[ 'edit', 'edit' ],
			[ 'save', 'save' ],
			[ 'view', 'view' ],
			[ 'editField', 'edit-field' ],
			[ 'editToolbar', 'edit-toolbar' ],
			[ 'editGeneral', 'edit-general' ],
			[ 'editAdvanced', 'edit-advanced' ],
		];

		partNames.forEach( ( [ uiKey, fileName ] ) => {
			try {
				blockUI[ uiKey ] = require( `./${ blockName }/${ fileName }` ).default;
			} catch ( e ) {}
		} );

		BlocksStore.add(
			new BlockInstance( blockName, { ...blockData, ...blockUI } )
		);
	} );

	BlocksStore.registerAll();
};

( () => {
	try {
		setupBlocks();
	} catch ( exception ) {
		console.error( exception );
	}
} )()