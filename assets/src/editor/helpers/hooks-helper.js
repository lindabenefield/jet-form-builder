import { saveGlobalComponent } from "../components/manager";
import { ValidateButton } from "../components/validate-button";
import { ActionFieldsMap } from "../components/actions/action-fields-map";

const {
	useState,
	useEffect
} = wp.element;

const {
	useSelect,
	useDispatch,
} = wp.data;

export const useMeta = ( key, empty ) => {
	const meta = useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {};
	} );

	return [ ...useState( JSON.parse( meta[ key ] || empty ) ), meta ];
};

export const useMetaWithEffect = ( key, empty, subscriber = () => {} ) => {
	const {
		editPost
	} = useDispatch( 'core/editor' );

	const meta = useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {};
	} );

	const [ metaValue, setMetaValue ] = useState( JSON.parse( meta[ key ] || empty ) );

	useEffect( () => {

		editPost( {
			meta: ( {
				...meta,
				[ key ]: JSON.stringify( metaValue )
			} )
		} );

		subscriber( metaValue )

	}, [ metaValue ] );

	return [ metaValue, setMetaValue ];
};


export const useActions = ( withEditPostEffect = false ) => {
	const {
		editPost
	} = useDispatch( 'core/editor' );

	const [ actions, setActions, meta ] = useMeta( '_jf_actions', '[]' );

	useEffect( () => {
		if ( withEditPostEffect ) {
			editPost( {
				meta: ( {
					...meta,
					_jf_actions: JSON.stringify( actions )
				} )
			} );
		}
	}, [ actions ] );

	return [ actions, setActions ];
};

export const useFormArgs = () => {
	return useMeta( '_jf_args', '{}' );
};

export const useStateClasses = initialValid => {
	const validClass = 'is-valid';
	const invalidClass = 'is-invalid'
	const initClasses = [ 'jet-form-validate-button' ];

	const initStateClasses = () => {
		if ( initialValid ) {
			return [ ...initClasses, validClass ];
		} else if ( ! initialValid ) {
			return [ ...initClasses, invalidClass ];
		}
	};

	const [ classes, setClasses ] = useState( initStateClasses() );

	const setValidClass = () => {
		setClasses( [ ...initClasses, validClass ] )
	};
	const setInvalidClass = () => {
		setClasses( [ ...initClasses, invalidClass ] )
	};
	const setLoadingClass = () => {
		setClasses( [ ...initClasses, 'loading' ] )
	};

	return [ classes.join( ' ' ), setValidClass, setInvalidClass, setLoadingClass ];
}

saveGlobalComponent( 'JetFBHooks', { useActions, useStateClasses } );
