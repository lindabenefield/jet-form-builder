import JetFormToolbar from '../controls/toolbar';
import JetFormAdvanced from '../controls/advanced';

const block = 'jet-forms/group-break-field';

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


const keyControls = block + '-controls-edit';
const keyPlaceHolder = block + '-placeholder-edit';
const keyGeneral = block + '-general-edit';

export default class HeadingEdit extends wp.element.Component {
	render() {
		const props = this.props;
		const attributes = props.attributes;
		const hasToolbar = Boolean( window.jetFormBuilderControls.toolbar[ block ] && window.jetFormBuilderControls.toolbar[ block ].length );

		return [
			hasToolbar && (
				<BlockControls key={ keyControls + '-block' }>
					<JetFormToolbar
						values={ attributes }
						controls={ window.jetFormBuilderControls.toolbar[ block ] }
						onChange={ ( newValues ) => {
							props.setAttributes( newValues );
						} }
					/>
				</BlockControls>
			),
			props.isSelected && (
				<InspectorControls
					key={ keyControls }
				>
					{ window.jetFormBuilderControls.advanced[ block ] && window.jetFormBuilderControls.advanced[ block ].length &&
					<JetFormAdvanced
						values={ attributes }
						controls={ window.jetFormBuilderControls.advanced[ block ] }
						onChange={ ( newValues ) => {
							props.setAttributes( newValues );
						} }
					/> }
				</InspectorControls>
			),
			<div className={ 'jet-form-builder__group-break' }>
				<span>{ __( 'GROUP BREAK' ) }</span>
			</div>
		];
	}
}