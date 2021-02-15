import JetFormToolbar from '../controls/toolbar';
import JetFormGeneral from '../controls/general';
import JetFormAdvanced from '../controls/advanced';
import JetFieldPlaceholder from '../controls/placeholder';
import Tools from "../../helpers/tools";

const block = 'jet-forms/repeater-field';

window.jetFormBuilderBlockCallbacks = window.jetFormBuilderBlockCallbacks || {};
window.jetFormBuilderBlockCallbacks[ block ] = window.jetFormBuilderBlockCallbacks[ block ] || {};

const { __ } = wp.i18n;

const {
	ColorPalette,
	RichText,
	Editable,
	MediaUpload,
	ServerSideRender,
	BlockControls,
	InspectorControls,
	InnerBlocks,
} = wp.blockEditor ? wp.blockEditor : wp.editor;

const {
	select,
} = wp.data;

const {
	PanelColor,
	IconButton,
	TextControl,
	TextareaControl,
	SelectControl,
	ToggleControl,
	PanelBody,
	Button,
	RangeControl,
	CheckboxControl,
	Disabled,
	Popover,
	BaseControl,
	ToolbarItem,
	__experimentalNumberControl,
} = wp.components;


let { NumberControl } = wp.components;

if ( typeof NumberControl === 'undefined' ) {
	NumberControl = __experimentalNumberControl;
}

const { useState } = wp.element;

const keyControls = block + '-controls-edit';
const keyPlaceHolder = block + '-placeholder-edit';
const keyGeneral = block + '-general-edit';

export default function RepeaterEdit( props ) {

	const { attributes, controls, setAttributes } = props;
	const data = window.jetRepeaterFieldData;

	const [ showPopover, setShowPopover ] = useState( false );

	const formFields = Tools.getAvailableFields( [ block ] );
	const label = Tools.getLabel( attributes );

	const insertMacros = ( macros ) => {
		const formula = attributes.calc_formula || '';
		setAttributes( { calc_formula: formula + '%FIELD::' + macros + '%' } );
	}

	return [
		<BlockControls key={ keyControls + '-block' }>
			<JetFormToolbar
				values={ attributes }
				controls={ controls.toolbar }
				onChange={ ( newValues ) => {
					setAttributes( newValues );
				} }
			>
				{ 'custom' === attributes.repeater_calc_type && <Button
					isTertiary
					isSmall
					icon={ showPopover ? 'no-alt' : 'admin-tools' }
					onClick={ () => {
						setShowPopover( prev => ! prev )
					} }
				/> }
				{ showPopover && (
					<Popover
						position={ 'bottom left' }
					>
						{ formFields.length && <PanelBody title={ 'Form Fields' }>
							{ formFields.map( field => {
								return <div key={ 'field_' + field }>
									<Button
										isLink
										onClick={ () => {
											insertMacros( field )
										} }
									>{ '%FIELD::' + field + '%' }</Button>
								</div>;
							} ) }
						</PanelBody> }
					</Popover>
				) }
			</JetFormToolbar>
		</BlockControls>,
		props.isSelected && (
			<InspectorControls
				key={ keyControls }
			>
				<JetFormGeneral
					key={ keyGeneral }
					values={ attributes }
					controls={ controls.general }
					onChange={ setAttributes }
				/>
				<PanelBody
					title={ __( 'Field Settings' ) }
				>
					<SelectControl
						key='manage_items_count'
						label={ __( 'Manage repeater items count' ) }
						labelPosition='top'
						value={ attributes.manage_items_count }
						onChange={ newValue => {
							setAttributes( { manage_items_count: newValue } );
						} }
						options={ data.manage_items_count }
					/>
					{ 'manually' === attributes.manage_items_count && <TextControl
						key='new_item_label'
						label={ __( 'Add New Item Label' ) }
						value={ attributes.new_item_label }
						onChange={ ( newValue ) => {
							setAttributes( { new_item_label: newValue } );
						} }
					/> }
					{ 'dynamically' === attributes.manage_items_count && <SelectControl
						key='manage_items_count_field'
						label={ __( 'Field items count' ) }
						labelPosition='top'
						value={ attributes.manage_items_count_field }
						onChange={ newValue => {
							setAttributes( { manage_items_count_field: newValue } );
						} }
						options={ [
							{ label: __( 'Select field...' ) },
							...Tools.getFormFieldsBlocks( [ block ] )
						] }
					/> }

					<SelectControl
						key='repeater_calc_type'
						label={ __( 'Calculate repeater row value' ) }
						labelPosition='top'
						value={ attributes.repeater_calc_type }
						onChange={ newValue => {
							setAttributes( { repeater_calc_type: newValue } );
						} }
						options={ data.repeater_calc_type }
					/>
					{ 'custom' === attributes.repeater_calc_type && <div className="jet-form-editor__row-notice">
						{ __( 'Set math formula to calculate field value.', 'jet-form-builder' ) }<br/>
						{ __( 'For example:', 'jet-form-builder' ) }<br/><br/>
						%FIELD::quantity%*%META::price%<br/><br/>
						{ __( 'Where:', 'jet-form-builder' ) }<br/>
						-
						{ __( '%FIELD::quantity% - macros for form field value. "quantity" - is a field name to get value from', 'jet-form-builder' ) }<br/>
						-
						{ __( '%META::price% - macros for current post meta value. "price" - is a meta key to get value from', 'jet-form-builder' ) }<br/><br/>
					</div> }


				</PanelBody>
				<JetFormAdvanced
					values={ attributes }
					controls={ controls.advanced }
					onChange={ setAttributes }
				/>
			</InspectorControls>
		),
		<React.Fragment>
			{ 'custom' === attributes.repeater_calc_type && <div className="jet-forms__calc-formula-editor">
				<div className="jet-form-editor__macros-wrap">
					<TextareaControl
						key="calc_formula"
						value={ attributes.calc_formula }
						label={ __( 'Calculation Formula for Repeater' ) }

						onChange={ ( newValue ) => {
							setAttributes( { calc_formula: newValue } );
						} }
					/>
				</div>
			</div> }
			<BaseControl key={ 'repeater-fields-title' }>
				<BaseControl.VisualLabel>
					<div className={ 'jet-form-builder__label' }>
						{ label.name || 'Repeater field' }
						{ attributes.required && <span className={ 'jet-form-builder__required' }>
								{ label.mark ? label.mark : '*' }
							</span> }
					</div>
				</BaseControl.VisualLabel>
				<div className={ 'components-base-control__help jet-form-builder__desc' }
					 style={ { marginTop: '0px' } }>{ attributes.desc }</div>
			</BaseControl>

			<InnerBlocks
				key={ 'repeater-fields' }
				renderAppender={ () => (
					<InnerBlocks.ButtonBlockAppender/>
				) }
			/>
			<Button
				className={ 'jet-form-builder-repeater__remove' }
				isSecondary
				onClick={ () => {
				} }
			>&times;</Button>
			<div style={ { width: '100%', height: '0.7em' } }/>
			<div className="jet-form-builder-repeater__actions">
				<Button
					className={ 'jet-form-builder-repeater__new' }
					isSecondary
					onClick={ () => {
					} }
				>{ attributes.new_item_label || 'Add New' }</Button>
			</div>

		</React.Fragment>
	];
}