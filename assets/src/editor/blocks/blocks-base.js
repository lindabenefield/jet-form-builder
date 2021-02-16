import JetFormToolbar from "./controls/toolbar";
import JetFormGeneral from "./controls/general";
import JetFormAdvanced from "./controls/advanced";

const {
	ColorPalette,
	RichText,
	Editable,
	MediaUpload,
	ServerSideRender,
	BlockControls,
	InspectorControls,
} = wp.blockEditor ? wp.blockEditor : wp.editor;

export const baseBlocks = {
	editToolbar: props => {
		const { controls, setAttributes, attributes, clientId } = props;
		const hasControls = Boolean( controls.toolbar && controls.toolbar.length );

		return hasControls && <BlockControls
			key={ `jet-form-toolbar-${ clientId }` }
		>
			<JetFormToolbar
				values={ attributes }
				controls={ controls.toolbar }
				onChange={ setAttributes }
			/>
		</BlockControls>;
	},
	editGeneral: props => {
		const { controls, setAttributes, attributes, isSelected, clientId } = props;
		const hasControls = Boolean( controls.general && controls.general.length );

		return ( isSelected && hasControls ) && <InspectorControls
			key={ `jet-form-general-${ clientId }` }
		>
			<JetFormGeneral
				key={ `jet-form-general-component-${ clientId }` }
				values={ attributes }
				controls={ controls.general }
				onChange={ setAttributes }
			/>
		</InspectorControls>;
	},
	editAdvanced: props => {
		const { controls, setAttributes, attributes, isSelected, clientId } = props;
		const hasControls = Boolean( controls.advanced && controls.advanced.length );

		return ( isSelected && hasControls ) && <InspectorControls
			key={ `jet-form-advanced-${ clientId }` }
		>
			<JetFormAdvanced
				values={ attributes }
				key={ `jet-form-advanced-component-${ clientId }` }
				controls={ controls.advanced }
				onChange={ setAttributes }
			/>
		</InspectorControls>
	},
	editField: props => null,
	"global": {
		"label": {
			"type": "string",
			"default": "",
			"general": {
				"type": "text",
				"label": "Field Label"
			}
		},
		"name": {
			"type": "string",
			"default": "field_name",
			"general": {
				"type": "text",
				"label": "Form field name",
				"help": "Should contain only Latin letters, numbers, `-` or `_` chars, no spaces only lower case"
			}
		},
		"desc": {
			"type": "string",
			"default": "",
			"general": {
				"type": "text",
				"label": "Field Description"
			}
		},
		"default": {
			"type": "string",
			"default": "",
			"general": {
				"type": "dynamic_text",
				"label": "Default Value"
			}
		},
		"placeholder": {
			"type": "string",
			"default": "",
			"advanced": {
				"type": "text",
				"label": "Placeholder"
			}
		},
		"required": {
			"type": "boolean",
			"default": false,
			"toolbar": {
				"type": "toggle",
				"label": "Is Required"
			}
		},
		"add_prev": {
			"type": "boolean",
			"default": false,
			"advanced": {
				"type": "toggle",
				"label": "Add Prev Page Button"
			}
		},
		"prev_label": {
			"type": "string",
			"default": "",
			"advanced": {
				"type": "text",
				"label": "Prev Page Button Label",
				"condition": "add_prev"
			}
		},
		"visibility": {
			"type": "string",
			"default": "",
			"advanced": {
				"type": "select",
				"label": "Field Visibility",
				"options": [
					{
						"value": "all",
						"label": "For all"
					},
					{
						"value": "logged_id",
						"label": "Only for logged in users"
					},
					{
						"value": "not_logged_in",
						"label": "Only for NOT-logged in users"
					}
				]
			}
		},
		"class_name": {
			"type": "string",
			"default": "",
			"advanced": {
				"type": "text",
				"label": "CSS Class Name"
			}
		}
	}
}