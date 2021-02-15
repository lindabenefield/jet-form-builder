import JetFormToolbar from '../controls/toolbar';
import JetFormGeneral from '../controls/general';
import JetFormAdvanced from '../controls/advanced';
import Tools from "../../helpers/tools";
import FieldWrapper from '../../components/field-wrapper';

const block = 'jet-forms/datetime-field';

const { __ } = wp.i18n;

const {
	ColorPalette,
	RichText,
	Editable,
	MediaUpload,
	ServerSideRender,
	BlockControls,
	InspectorControls,
} = wp.blockEditor ? wp.blockEditor : wp.editor;

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
	DateTimePicker,
	Disabled,
} = wp.components;


const keyControls = block + '-controls-edit';
const keyGeneral = block + '-general-edit';

export default function DateTimeEdit( props ) {
	const {
		setAttributes,
		controls,
		attributes,
		isSelected
	} = props;

	return [
		<BlockControls key={ keyControls + '-block' }>
			<JetFormToolbar
				values={ attributes }
				controls={ controls.toolbar }
				onChange={ setAttributes }
			/>
		</BlockControls>,
		isSelected && <InspectorControls
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
				<ToggleControl
					key='is_timestamp'
					label={ __( 'Is Timestamp' ) }
					checked={ attributes.is_timestamp }
					help={ Tools.getHelpMessage( window.jetFormDatetimeFieldData, 'is_timestamp' ) }
					onChange={ ( newValue ) => {
						setAttributes( { is_timestamp: Boolean( newValue ) } );
					} }
				/>
			</PanelBody>
			<JetFormAdvanced
				values={ attributes }
				controls={ controls.advanced }
				onChange={ setAttributes }
			/>
		</InspectorControls>,
		<FieldWrapper
			block={ block }
			attributes={ attributes }
			key={ `wrapper-${ block }` }
		>
			<TextControl
				onChange={ () => {
				} }
				key={ `place_holder_block_${ block }` }
				placeholder={ 'Input type="datetime-local"' }
			/>
		</FieldWrapper>
	];
}