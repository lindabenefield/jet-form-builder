import JetFormToolbar from '../controls/toolbar';
import JetFormGeneral from '../controls/general';
import JetFormAdvanced from '../controls/advanced';
import JetFieldPlaceholder from '../controls/placeholder';

const block = 'jet-forms/submit-field';

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
	Disabled,
} = wp.components;

const keyControls = () => block + '-controls-edit';
const keyGeneral = block + '-general-edit';

export default function SubmitEdit( props ) {
	const { attributes, setAttributes, controls, isSelected } = props;

	return [
		<BlockControls key={ keyControls() }>
			<JetFormToolbar
				values={ attributes }
				controls={ controls.toolbar }
				onChange={ ( newValues ) => {
					setAttributes( newValues );
				} }
			/>
		</BlockControls>,
		isSelected && <InspectorControls
			key={ 'inspector' }
		>
			<JetFormGeneral
				key={ keyGeneral }
				values={ attributes }
				controls={ controls.general }
				onChange={ ( newValues ) => {
					setAttributes( newValues );
				} }
			/>
			<JetFormAdvanced
				values={ attributes }
				controls={ controls.advanced }
				onChange={ ( newValues ) => {
					setAttributes( newValues );
				} }
			/>
		</InspectorControls>,
		<div className="jet-form-builder__submit-wrap" key={ 'jet-form-builder__submit-wrap' }>
			<Button
				key={ `place_holder_block_${ block }` }
				isPrimary
				className={ 'jet-form-builder__submit' }
			>
				{ attributes.label }
			</Button>
		</div>
	];
}