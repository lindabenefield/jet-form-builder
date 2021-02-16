import FieldWithPreset from "../../components/field-with-preset";
import DynamicPreset from "../../components/presets/dynamic-preset";
import { saveGlobalComponent } from "../../components/manager";

/**
 * WordPress dependencies
 */
const { withInstanceId } = window.wp.compose;

/**
 * Internal dependencies
 */
const {
	TextControl,
	PanelBody,
	G,
	Path,
	Circle,
	Rect,
	SVG,
	Modal,
	Button,
	ButtonGroup
} = wp.components;

const { __ } = wp.i18n;

const {
	useState,
	useEffect,
	useRef
} = wp.element;

function JetFormGeneral( props ) {
	const { onChange, controls, values } = props;

	const [ result, setResult ] = useState( () => {
		const response = {};

		for ( let i = 0; i < controls.length; i ++ ) {
			response[ controls[ i ].key ] = values[ controls[ i ].key ];
		}

		return response;
	} );

	const onChangeValue = ( value, key ) => {
		setResult( prev => ( { ...prev, [ key ]: value } ) );
	};

	useEffect( () => {
		onChange( result );

	}, [ result ] );

	/* eslint-disable jsx-a11y/no-onchange */
	return <PanelBody title={ __( 'General' ) } key={ 'test-general-key' }>
		{ controls.map( ( data, index ) => {
			if ( ! data.show ) {
				return null;
			}
			switch ( data.type ) {
				case 'text':
					return <TextControl
						key={ data.key }
						label={ data.label }
						help={ data.help ? data.help : '' }
						value={ result[ data.key ] }
						onChange={ newVal => {
							onChangeValue( newVal, data.key )
						} }
					/>;
				case 'dynamic_text':
					return <FieldWithPreset
						ModalEditor={ ( { actionClick, onRequestClose } ) => <DynamicPreset
							key={ `dynamic_text_${ data.key }` }
							value={ result[ data.key ] }
							isSaveAction={ actionClick }
							onSavePreset={ newVal => {
								onChangeValue( newVal, data.key )
							} }
							onUnMount={ onRequestClose }
						/> }
					>
						<TextControl
							key={ data.key }
							label={ data.label }
							help={ data.help ? data.help : '' }
							value={ result[ data.key ] }
							onChange={ newVal => {
								onChangeValue( newVal, data.key )
							} }
						/>
					</FieldWithPreset>;
			}
		} ) }
	</PanelBody>
	/* eslint-enable jsx-a11y/no-onchange */
}

saveGlobalComponent( 'JetFBComponents', { JetFormGeneral } );

export default withInstanceId( JetFormGeneral );