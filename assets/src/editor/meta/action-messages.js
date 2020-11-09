const {
    TextControl,
    ToggleControl,
    SelectControl,
    BaseControl
} = wp.components;

const { __ } = wp.i18n;


class ActionMessages extends wp.element.Component {

    constructor( props ) {
        super( props );

        this.data = props.localizedData;

        console.log( this.messages );

        this.setMessages();
    }

    setMessages() {
        if ( this.props.settings && this.props.settings.messages ) {
            return;
        }
        const messages = {};

        Object.entries( this.data.messages ).forEach( ( [ type, data ] ) => {
            messages[ type ] = data.value;
        } )

        this.props.onChange( {
            ...this.props.settings,
            messages: messages
        } );
    }

    getMessage( name ) {
        const settings = this.props.settings;

        if (settings['messages'] && settings['messages'][ name ]) {
            return settings['messages'][ name ];
        }
        return '';
    }


    changeFieldsMap( { source, nameField, value } ) {
        const fieldsMap = Object.assign(
            {},
            this.props.settings[ source ],
            { [ nameField ]: value }
        );

        this.props.onChange( {
            ...this.props.settings,
            [ source ]: fieldsMap
        } );
    }

    render() {
        const settings = this.props.settings;

        const onChangeMessage = ( value, nameField ) => {
            const source = 'messages';

            this.changeFieldsMap(
                { value, nameField, source }
            );
        };

        return <BaseControl
            label={ __( 'Messages Settings:' ) }
            key='messages_settings_fields'
        >
            <div className='jet-user-meta-rows'>
                { settings.messages && Object.entries( settings.messages )
                    .map( ( [ type, data ], id ) => {

                        return <div
                            className="jet-user-meta__row"
                            key={ 'message_' + type + id }
                        >
                            <TextControl
                                key={ type + id }
                                label={ this.data.messages[ type ].label }
                                value={ this.getMessage( type ) }
                                onChange={ newValue => onChangeMessage( newValue, type ) }
                            />
                        </div>;
                    } ) }
            </div>
        </BaseControl>;
    }
}

export default ActionMessages;