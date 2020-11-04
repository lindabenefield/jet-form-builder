<?php
namespace Jet_Form_Builder\Blocks\Types;

// If this file is called directly, abort.
use Jet_Form_Builder\Classes\Tools;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Define Base_Type class
 */
abstract class Base {

	private $_unregistered = array();

	public function __construct() {

        $this->_register_block();

		add_filter( 'jet-form-builder/editor/allowed-blocks', function( $blocks ) {
			$blocks[] = $this->block_name();
			return $blocks;
		} );

	}

	private function _register_block() {
        register_block_type(
            $this->block_name(),
            $this->block_params()
        );
    }

    public function block_params() {
        return array(
            'attributes'		=> $this->block_attributes(),
            //'render_callback' 	=> array( $this, 'render_callback_field' ),
            //'editor_style'    => 'jet-engine-frontend',
        );
    }

	public function get_storage_name() {
	    return jet_form_builder()->blocks::FORM_EDITOR_STORAGE;
    }

	/**
	 * Returns block title
	 *
	 * @return string
	 */
	abstract public function get_title();

	/**
	 * Returns block name/slug
	 *
	 * @return string
	 */
	abstract public function get_name();

	/**
	 * Return attributes array
	 *
	 * @return array
	 */
	abstract public function get_attributes();

	/**
	 * Retruns block icon WP dashicon class name without prefix, for example 'edit-large' or custom SVG component code
	 *
	 * @return [type] [description]
	 */
	abstract public function get_icon();

	/**
	 * Returns renderer class instance for current block
	 *
	 * @param  array  $attributes [description]
	 * @return [type]             [description]
	 */
	abstract public function get_block_renderer( $form_id, $attributes = array() );

	/**
	 * Render callback for the block
	 *
	 * @param  array  $attributes [description]
	 * @return [type]             [description]
	 */
	public function render_callback_field( $attributes = array() ) {
		return $this->get_block_renderer()->render();
	}

	/**
	 * Remove attribute from registered
	 * (should be called only inside get_attributes() method)
	 *
	 * @param  [type] $key [description]
	 * @return [type]      [description]
	 */
	public function unregister_attribute( $key ) {
		$this->_unregistered[] = $key;
	}

    public function unregister_attributes( $keys = array() ) {
        $this->_unregistered = array_merge(
            $this->_unregistered,
            $keys
        );
    }

	/**
	 * Returns full block name
	 *
	 * @return [type] [description]
	 */
	public function block_name() {
		return jet_form_builder()->form::NAMESPACE_FIELDS . $this->get_name();
	}

	/**
	 * Returns default class name for the block
	 *
	 * @return [type] [description]
	 */
	public function block_class_name() {
		return 'jet-form-' . $this->get_name();
	}

	public function get_block_field_type() {
		return explode( '-', $this->get_name() )[0];
	}

	/**
	 * Returns global attributes list
	 *
	 * @return [type] [description]
	 */
	public function get_global_attributes() {
		return array(
			'label' => array(
				'type'    => 'string',
				'default' => '',
				'general' => array(
					'type'  => 'text',
					'label' => __( 'Field Label', 'jet-form-builder' )
				),
			),
			'name' => array(
				'type' => 'string',
				'default' => 'field_name',
				'general' => array(
					'type'  => 'text',
					'label' => __( 'Field Name', 'jet-form-builder' )
				),
			),
			'desc' => array(
				'type' => 'string',
				'default' => '',
				'general' => array(
					'type'  => 'text',
					'label' => __( 'Field Description', 'jet-form-builder' )
				),
			),
			'default' => array(
				'type' => 'string',
				'default' => '',
				'general' => array(
					'type'  => 'dynamic_text',
					'label' => __( 'Default Value', 'jet-form-builder' )
				),
			),
			'placeholder' => array(
				'type' => 'string',
				'default' => '',
				'advanced' => array(
					'type'  => 'text',
					'label' => __( 'Placeholder', 'jet-form-builder' )
				),
			),
			'required' => array(
				'type'    => 'boolean',
				'default' => false,
				'toolbar' => array(
					'type'  => 'toggle',
					'label' => __( 'Is Required', 'jet-form-builder' )
				),
			),
			'add_prev' => array(
				'type' => 'boolean',
				'default' => false,
				'advanced' => array(
					'type'  => 'toggle',
					'label' => __( 'Add Prev Page Button', 'jet-form-builder' )
				),
			),
			'prev_label' => array(
				'type' => 'string',
				'default' => '',
				'advanced' => array(
					'type'      => 'text',
					'label'     => __( 'Prev Page Button Label', 'jet-form-builder' ),
					'condition' => 'add_prev'
				),
			),
			'visibility' => array(
				'type' => 'string',
				'default' => '',
				'advanced' => array(
					'type'    => 'select',
					'label'   => __( 'Field Visibility', 'jet-form-builder' ),
					'options' => array(
						array(
							'value' => 'all',
							'label' => __( 'For all', 'jet-form-builder' ),
						),
						array(
							'value' => 'logged_id',
							'label' => __( 'Only for logged in users', 'jet-form-builder' ),
						),
						array(
							'value' => 'not_logged_in',
							'label' => __( 'Only for NOT-logged in users', 'jet-form-builder' ),
						),
					),
				),
			),
			'class_name' => array(
				'type' => 'string',
				'default' => '',
				'advanced' => array(
					'type'  => 'text',
					'label' => __( 'CSS Class Name', 'jet-form-builder' )
				),
			),
		);
	}

	/**
	 * Retruns attra from input array if not isset, get from defaults
	 *
	 * @return [type] [description]
	 */
	public function get_attr( $attr = '', $all = array() ) {
		if ( isset( $all[ $attr ] ) ) {
			return $all[ $attr ];
		} else {
			$defaults = $this->block_attributes();
			return isset( $defaults[ $attr ]['default'] ) ? $defaults[ $attr ]['default'] : '';
		}
	}

	/**
	 * Returns all block attributes list (custom + general + system)
	 *
	 * @return [type] [description]
	 */
	public function block_attributes() {

		$attributes = $this->get_attributes();

		/**
		 * Set default blocks attributes to avoid errors
		 */
		$attributes['className'] = array(
			'type'    => 'string',
			'default' => '',
		);

		/**
		 * This attribute should not change 
		 */
		$attributes['type'] = array(
			'type'    => 'string',
			'default' => $this->get_block_field_type(),
		);

		$global_attributes = $this->get_global_attributes();

		if ( ! empty( $global_attributes ) ) {
			$attributes = array_merge( $attributes, $global_attributes );
		}

		if ( ! empty( $this->_unregistered ) ) {
			foreach ( $this->_unregistered as $key ) {
				unset( $attributes[ $key ] );
			}
		}

		return $attributes;

	}

	/**
	 * Register blocks specific JS variables
	 *
	 * @param  [type] $editor [description]
	 * @param  [type] $handle [description]
	 * @return [type]         [description]
	 */
	public function block_data( $editor, $handle ) {
	}

	/**
	 * Allow to filter raw attributes from block type instance to adjust JS and PHP attributes format
	 *
	 * @param  [type] $attributes [description]
	 * @return [type]             [description]
	 */
	public function prepare_attributes( $attributes ) {
		return $attributes;
	}

	/**
	 * Render callback for the block
	 *
	 * @param  array  $attributes [description]
	 * @return [type]             [description]
	 */
	public function render_callback( $attributes = array() ) {

		$renderer = $this->get_block_renderer( $attributes );

		if ( $renderer ) {
			ob_start();
			$renderer->render();
			return ob_get_clean();
		}

	}

}
