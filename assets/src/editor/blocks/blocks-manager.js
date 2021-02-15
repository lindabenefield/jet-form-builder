const {
	registerBlockType
} = wp.blocks;

const blocks = [
	'text-field',
	'datetime-field',
	'repeater-field',
	'submit-field',
	'hidden-field',
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
	'conditional-block'
];

const blockBase = require( './blocks-base.json' );

const getControlsList = ( attributes, context ) => {
	attributes = Object.entries( attributes );

	const response = [];

	attributes.forEach( ( [ attrName, attrValue ] ) => {
		if ( ! attrValue[ context ] ) {
			return;
		}

		const option = ( name, empty ) => {
			if ( ! attrValue[ context ][ name ] ) {
				return empty;
			}
			return attrValue[ context ][ name ];
		}

		response.push( {
			key: attrName,
			type: option( 'type' ),
			label: option( 'label' ),
			options: option( 'options', [] ),
			condition: option( 'condition', false ),
			show: option( 'show', true ),
			help: option( 'help', '' )
		} );
	} );

	return response;
};

function blockWrapper( additionalProps, Instance ) {
	return function JetFormFieldWrapper( props ) {
		return <Instance { ...props } { ...additionalProps }/>;
	}
}

const withDataBlockWrapper = blockData => {
	const additionalProps = {
		controls: {
			toolbar: getControlsList( blockBase.global, 'toolbar' ),
			general: getControlsList( blockBase.global, 'general' ),
			advanced: getControlsList( blockBase.global, 'advanced' )
		},
		localized: blockData.localizeData ? window[ blockData.localizeData ] : {}
	};

	return Instance => blockWrapper( additionalProps, Instance );
};

( () => {

	let registeredBlocks = {};

	blocks.forEach( blockName => {
		const blockData = require( `./${ blockName }/block.json` );

		blockData.supports = {
			customClassName: false,
			html: false,
			...( blockData.supports || {} )
		};
		blockData.icon = blockData.icon || 'image-filter';

		const getInstance = withDataBlockWrapper( blockData );

		const blockUI = {
			edit: getInstance( require( `./${ blockName }/edit` ).default ),
			save: require( `./${ blockName }/save` ).default
		};

		registeredBlocks[ `jet-forms/${ blockName }` ] = {
			...blockData,
			...blockUI,
			icon: <span dangerouslySetInnerHTML={ { __html: blockData.icon } }></span>,
			category: 'jet-form-builder-fields',
			className: `jet-form-${ blockName }`,
		};
	} );

	const parseAttributes = attrs => {
		let responseAttrs = {};

		for ( const attrsKey in attrs ) {
			if ( registeredBlocks[ attrsKey ] && 'inherit' === attrs[ attrsKey ] ) {
				responseAttrs = { ...registeredBlocks[ attrsKey ].attributes, ...responseAttrs };
				continue;
			}
			responseAttrs[ attrsKey ] = attrs[ attrsKey ];
		}

		return responseAttrs;
	};

	Object.entries( registeredBlocks ).forEach( ( [ blockName, blockData ] ) => {
		blockData.attributes = {
			...parseAttributes( blockData.attributes ),
			...( blockData.global || blockBase.global )
		};

		registerBlockType( blockName, blockData )
	} );

} )()






