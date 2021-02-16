import JetFieldPlaceholder from "../controls/placeholder";


export default function HiddenView( props ) {
	const { attributes, clientId } = props;

	return <JetFieldPlaceholder
		key={ `hidden-field-${ clientId }` }
		title={ 'Hidden Field' }
		subtitle={ [ attributes.name ] }
		isRequired={ attributes.required }
	/>;
}