
const { __ } = wp.i18n;

class Tools {

    static getHelpMessage( from, name ) {
        if( typeof from.help_messages[ name ] !== 'undefined' ) {
            return from.help_messages[ name ];
        }

        if ( typeof from.help_messages[ attributes.generator_function ] === 'object' ) {
            return from.help_messages[ attributes.generator_function ][ name ];
        }
    }

    static getFormFieldsBlocks( exclude = [] ) {
        const formFields = [];

        let skipFields = [ 'submit', 'page_break', 'heading', 'group_break', 'repeater_end', ...exclude ];

        const blocksRecursiveIterator = ( blocks ) => {

            blocks = blocks || wp.data.select( 'core/block-editor' ).getBlocks();

            blocks.map( ( block ) => {

                if ( block.name.includes( 'jet-forms/' )
                    && block.attributes.name
                    && ! skipFields.find( field => block.name.includes( field ) )
                ) {
                    formFields.push( {
                        blockName: block.name,
                        name: block.attributes.name,
                        label: block.attributes.label || block.attributes.name,
                        value: block.attributes.name,
                    } );
                }

                if ( block.innerBlocks.length ) {
                    blocksRecursiveIterator( block.innerBlocks );
                }

            } );

        };

        blocksRecursiveIterator();
        return formFields;
    }

    static getAvailableFields( exclude = [] ) {

        let fields = [];


        const blocks = this.getFormFieldsBlocks( exclude );

        if ( blocks ) {
            blocks.forEach( item => fields.push( item.name ) );
        }
        return fields;
    }

    static getAvailableFieldsString() {
        const fields = this.getAvailableFields( ['calculated'] );

        let fieldsString = __( 'Available fields: ' );
        fields.forEach( function ( item ) {
            fieldsString += '%FIELD::' + item + '%, ';
        } );

        return  fieldsString;
    }
}

export default Tools;