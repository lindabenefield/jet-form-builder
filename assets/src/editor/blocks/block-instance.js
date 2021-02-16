import BlocksStore from "./blocks-store";

const { baseBlocks } = require( './blocks-base.js' );

const {
	registerBlockType
} = wp.blocks;

const {
	InspectorControls,
} = wp.blockEditor ? wp.blockEditor : wp.editor;

const {
	PanelBody,
} = wp.components;

const { __ } = wp.i18n;

class BlockInstance {

	constructor( name, settings ) {
		this.setBlockName( name )
		this.settings = settings;
	}

	setBlockName( name ) {
		this.blockName = BlocksStore.makeBlockName( name );
	}

	blockWrapper( additionalProps, Instance, componentName ) {
		return function JetFormFieldWrapper( props ) {
			if ( 'editField' === componentName ) {
				return props.isSelected && <InspectorControls
					key={ `jet-form-edit-field-${ props.clientId }` }
				>
					<PanelBody
						title={ __( 'Field Settings' ) }
					>
						<Instance { ...props } { ...additionalProps }/>
					</PanelBody>
				</InspectorControls>
			}
			return <Instance { ...props } { ...additionalProps }/>;
		}
	}

	prepareEdit() {
		const getInstance = this.withDataBlockWrapper();

		const additionalComponents = [
			'view',
			'editToolbar',
			'editGeneral',
			'editField',
			'editAdvanced',
		];

		if ( this.settings.edit ) {
			return getInstance( this.settings.edit );
		} else if ( this.settings.view ) {

			return props => additionalComponents.map( ( componentName, index ) => {
				const component = this.settings[ componentName ] || baseBlocks[ componentName ];
				const Component = getInstance( component, componentName );

				return <Component
					key={ `jet-form-additional-component-${ props.clientId }-${ index }` }
					{ ...props }
				/>;
			} );

		} else {
			throw new Error( `There is no view-components for ${ this.blockName }` );
		}
	}

	withDataBlockWrapper = () => {
		const additionalProps = {
			controls: {
				toolbar: this.getControlsList( 'toolbar' ),
				general: this.getControlsList( 'general' ),
				advanced: this.getControlsList( 'advanced' )
			},
			localized: this.settings.localized ? window[ this.settings.localized ] : {}
		};

		return ( Instance, componentName ) => this.blockWrapper( additionalProps, Instance, componentName );
	};

	getControlsList( context ) {
		const attributes = Object.entries( this.settings.global || baseBlocks.global );

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

	prepareAttributes() {
		return {
			...BlocksStore.parseAttributes( this.settings.attributes ),
			...( this.settings.global || baseBlocks.global )
		}
	}

	prepareIcon() {
		return this.settings.icon
			? <span dangerouslySetInnerHTML={ { __html: this.settings.icon } }></span>
			: 'image-filter';
	}

	prepareSupports() {
		return {
			customClassName: false,
			html: false,
			...( this.settings.supports || {} )
		};
	}

	parseBlockData() {
		if ( ! ( this.settings.edit || this.settings.view )
			|| ! this.settings.save
			|| ! this.settings.title
			|| 'undefined' === typeof this.settings.attributes
			|| ( this.settings.localized && ! window[ this.settings.localized ] )
		) {
			console.warn( this.settings );
			throw new Error( `Failed ${ this.blockName } validation` );
		}
	};

	prepareCategory() {
		return ( this.settings.category || 'jet-form-builder-fields' );
	}

	prepareClassname() {
		return ( `jet-form-${ this.blockName } ` + ( this.settings.className || '' ) );
	}

	register() {
		try {
			this.parseBlockData();
		} catch ( e ) {
			console.error( e );
			return;
		}

		this.settings.attributes = this.prepareAttributes();
		this.settings.icon = this.prepareIcon();
		this.settings.supports = this.prepareSupports();
		this.settings.edit = this.prepareEdit();
		this.settings.category = this.prepareCategory();
		this.settings.className = this.prepareClassname();

		registerBlockType( this.blockName, { ...this.settings } );
	}

}

export default BlockInstance;