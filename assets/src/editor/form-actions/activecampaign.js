import IntegrationComponent from "./integration-component";

const {
	addAction,
	globalTab
} = JetFBActions;

/**
 * Internal dependencies
 */
const {
	TextControl,
	ToggleControl,
	SelectControl,
	BaseControl,
	Button,
} = wp.components;


const { __ } = wp.i18n;

const {
	useState
} = wp.element;

addAction( 'active_campaign', class ActiveCampaignAction extends IntegrationComponent {

	constructor( props ) {
		super( props );

		this.validateActiveCampaignData = this.validateActiveCampaignData.bind( this );
		this.getActiveCampaignData = this.getActiveCampaignData.bind( this );
	}

	validateActiveCampaignData( api_key = '', api_url = '' ) {
		this.setState( { className: [ 'loading' ] } );
		this.getActiveCampaignData( true, { api_key, api_url } );
	}

	getActiveCampaignData( isValidate = false, { api_key = '', api_url = '' } ) {
		const self = this,
			lists = [],
			endpoint = '/admin/api.php?api_action=list_list';

		const url = api_url + endpoint + '&api_key=' + api_key + '&ids=all&api_output=json';

		jQuery.getJSON( url )
		.success( function ( data ) {
			if ( undefined !== data.result_code && data.result_code ) {

				for ( var prop in data ) {
					if ( undefined === data[ prop ].id ) {
						continue;
					}
					lists.push( {
						value: data[ prop ].id,
						label: data[ prop ].name
					} );
				}

				self.onChangeSetting( lists, 'data' );
				self.onChangeSetting( true, 'isValidAPI' );
				self.setState( { className: [ 'is-valid' ] } );

			}
			else {
				self.onChangeSetting( false, 'isValidAPI' );
				self.setState( { className: [ 'is-invalid' ] } );
			}
		} )
		.error( function () {
			self.onChangeSetting( false, 'isValidAPI' );
			self.setState( { className: [ 'is-invalid' ] } );
		} );
	}

	getLists() {
		const settings = this.props.settings;

		if ( settings.data && settings.data ) {
			return this.addPlaceholderForSelect( settings.data );
		}
		return [];
	}


	formatEntriesArray( entries = [], isNeedPlaceholder = true ) {
		const placeholder = {
			label: '--'
		};
		if ( ! entries ) {
			return [];
		}

		const options = Object.entries( entries ).map( ( [ value, label ] ) => {
			return { value, label };
		} );

		return isNeedPlaceholder ? [ placeholder, ...options ] : options;
	}


	render() {
		const { settings, onChange, source, label, help } = this.props;
		const currentTab = globalTab( { slug: 'active-campaign-tab' } )

		/* eslint-disable jsx-a11y/no-onchange */
		return ( <React.Fragment key="activecampaign">
			<ToggleControl
				key={ 'use_global' }
				label={ label( 'use_global' ) }
				checked={ settings.use_global }
				onChange={ use_global => {
					this.onChangeSetting( Boolean( use_global ), 'use_global' )
				} }
			/>
			<BaseControl
				label={ label( 'api_data' ) }
				className='input-with-button with-wrap'
				key={ 'activecampaign_input_key' }
			>
				<TextControl
					key='api_url'
					help={ label( 'api_url' ) }
					className='jet-control-clear'
					disabled={ settings.use_global }
					value={ settings.use_global
						? currentTab.api_url
						: settings.api_url
					}
					onChange={ newVal => this.onChangeSetting( newVal, 'api_url' ) }
				/>
				<TextControl
					key='api_key'
					help={ label( 'api_key' ) }
					className='jet-control-clear'
					disabled={ settings.use_global }
					value={ settings.use_global
						? currentTab.api_key
						: settings.api_key
					}
					onChange={ newVal => this.onChangeSetting( newVal, 'api_key' ) }
				/>
				{ ( settings.api_key && settings.api_url ) && <Button
					key={ 'validate_api_key' }
					isPrimary
					onClick={ () => {
						settings.use_global
							? this.validateActiveCampaignData( currentTab.api_key, currentTab.api_url )
							: this.validateActiveCampaignData( settings.api_key, settings.api_url )

					} }
					className={ this.state.className.join( ' ' ) + ' jet-form-validate-button' }
				>
					<i className="dashicons"/>
					{ label( 'validate_api_key' ) }
				</Button> }
				<div/>
				<div>{ help( 'api_key_link_prefix' ) } <a
					href={ help( 'api_key_link' ) }>{ help( 'api_key_link_suffix' ) }</a>
				</div>
			</BaseControl>
			{ settings.isValidAPI && <React.Fragment>
				<BaseControl
					key='activecampaign_input_key'
					className='input-with-button'
				>
					<SelectControl
						className="full-width"
						key='activecampaign_select_lists'
						label={ label( 'list_id' ) }
						labelPosition="side"
						value={ settings.list_id }
						onChange={ newVal => this.onChangeSetting( newVal, 'list_id' ) }
						options={ this.getLists() }
					/>
					<Button
						key={ 'update_list_ids' }
						isPrimary
						onClick={ () => {
							settings.use_global
								? this.getActiveCampaignData( false, currentTab )
								: this.getActiveCampaignData( false, settings )
						} }
					>
						{ label( 'update_list_ids' ) }
					</Button>
				</BaseControl>
				<TextControl
					key='activecampaign_tags'
					label={ label( 'tags' ) }
					value={ settings.tags }
					help={ help( 'tags' ) }
					onChange={ newVal => this.onChangeSetting( newVal, 'tags' ) }
				/>
				<BaseControl
					label={ label( 'fields_map' ) }
					key='activecampaign_fields_map'
				>
					<div className='jet-user-meta-rows'>
						{ Object.entries( source.activecampaign_fields ).map(
							( [ fieldName, fieldLabel ], index ) => <div
								className="jet-user-meta__row"
								key={ 'user_meta_' + fieldName + index }
							>
								<SelectControl
									className="full-width"
									key={ fieldName + index }
									label={ fieldLabel }
									labelPosition="side"
									value={ this.getFieldDefault( fieldName ) }
									onChange={ value => this.onChangeFieldMap( value, fieldName ) }
									options={ this.formFieldsList }
								/>
							</div> ) }
					</div>
				</BaseControl>

			</React.Fragment> }

		</React.Fragment> );
		/* eslint-enable jsx-a11y/no-onchange */
	}
} );
