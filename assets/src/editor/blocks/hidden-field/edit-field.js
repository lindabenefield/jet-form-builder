const { __ } = wp.i18n;

const {
	TextControl,
	SelectControl,
} = wp.components;

export default function HiddenEdit( props ) {

	const { attributes, setAttributes, localized } = props;

	return <>
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
	</>;
}
