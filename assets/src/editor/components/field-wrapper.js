import Tools from "../helpers/tools";
import { useFormArgs, useMeta, useMetaWithEffect } from "../helpers/hooks-helper";

const {
	useEffect,
	useState,
} = wp.element;

const {
	useSelect,
	subscribe,
} = wp.data;

export default function FieldWrapper( { attributes, block, children, wrapClasses = [], valueIfEmptyLabel = '' } ) {
	const {
		BaseControl,
	} = wp.components;

	const [ label, setLabel ] = useState( {} );

	useMetaWithEffect( '_jf_args', '{}', newArgs => {
		setLabel( Tools.getLabel( attributes, newArgs ) );
	} );

	return (
		<BaseControl key={ `place_holder_block_${ block }_label` }
					 className={ `jet-form-builder__field-wrap jet-form-builder-row ${ wrapClasses.join( ' ' ) }` }>
			<BaseControl.VisualLabel>
				<div className={ 'jet-form-builder__label' }>
					{ label.name ? label.name : valueIfEmptyLabel }
					{ attributes.required && <span className={ 'jet-form-builder__required' }>
                        { label.mark ? label.mark : '*' }
                    </span> }
				</div>
			</BaseControl.VisualLabel>
			{ children }
			<BaseControl key={ 'custom_help_description' } className={ 'jet-form-builder__desc' }>
				<small className={ 'components-base-control__help' }
					   style={ { marginTop: '0px' } }>{ attributes.desc }</small>
			</BaseControl>
		</BaseControl>
	);
}