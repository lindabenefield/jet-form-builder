import JetFieldPlaceholder from "../controls/placeholder";
import JetFormToolbar from "../controls/toolbar";
import JetFormGeneral from "../controls/general";
import JetFormAdvanced from "../controls/advanced";

const { __ } = wp.i18n;

const {
	TextControl,
	SelectControl,
	PanelBody
} = wp.components;

const {
	BlockControls,
	InspectorControls,
	useBlockProps
} = wp.blockEditor ? wp.blockEditor : wp.editor;


export default function HiddenEdit( props ) {

	const { attributes, setAttributes, controls, localized, clientId } = props;

	return [
		<BlockControls
			key={ `jet-form-toolbar-${ clientId }` }
		>
			<JetFormToolbar
				values={ attributes }
				controls={ controls.toolbar }
				onChange={ setAttributes }
			/>
		</BlockControls>,
		props.isSelected && <InspectorControls
			key={ `jet-form-edit-field-${ clientId }` }
		>
			<JetFormGeneral
				key={ `jet-form-general-component-${ clientId }` }
				values={ attributes }
				controls={ controls.general }
				onChange={ setAttributes }
			/>
			<PanelBody
				title={ __( 'Field Settings' ) }
			>
				<SelectControl
					key='field_value'
					label="Field Value"
					labelPosition="top"
					value={ attributes.field_value }
					onChange={ ( newValue ) => {
						setAttributes( { field_value: newValue } );
					} }
					options={ localized.values }
				/>
				{ [ 'post_meta', 'user_meta' ].includes( attributes.field_value ) && <TextControl
					key="hidden_value_field"
					label="Meta Field to Get Value From"
					value={ attributes.hidden_value_field }
					onChange={ ( newValue ) => {
						setAttributes( { hidden_value_field: newValue } );
					} }
				/> }
				{ 'query_var' === attributes.field_value && <TextControl
					key="query_var_key"
					label="Query Variable Key"
					value={ attributes.query_var_key }
					onChange={ ( newValue ) => {
						setAttributes( { query_var_key: newValue } );
					} }
				/> }
				{ 'current_date' === attributes.field_value && <TextControl
					key="date_format"
					label="Format"
					value={ attributes.date_format }
					onChange={ ( newValue ) => {
						setAttributes( { date_format: newValue } );
					} }
				/> }
				{ 'manual_input' === attributes.field_value && <TextControl
					key="hidden_value"
					label="Value"
					value={ attributes.hidden_value }
					onChange={ ( newValue ) => {
						setAttributes( { hidden_value: newValue } );
					} }
				/> }
			</PanelBody>
			<JetFormAdvanced
				values={ attributes }
				key={ `jet-form-advanced-component-${ clientId }` }
				controls={ controls.advanced }
				onChange={ setAttributes }
			/>
		</InspectorControls>,
		<JetFieldPlaceholder
			key={ `hidden-field-${ clientId }` }
			title={ 'Hidden Field' }
			subtitle={ [ attributes.name ] }
			isRequired={ attributes.required }
		/>
	];
}
