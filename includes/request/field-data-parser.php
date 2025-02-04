<?php


namespace Jet_Form_Builder\Request;


use Jet_Form_Builder\Blocks\Modules\Fields_Errors\Error_Handler;

abstract class Field_Data_Parser {

	protected $value;
	protected $is_required = false;
	protected $name = 'field_name';
	protected $block;
	protected $settings;
	protected $inner;
	protected $request_handler;

	abstract public function type();

	public function get_response() {
		return $this->value;
	}

	public function _is_custom_check() {
		return false;
	}

	final public function response() {
		if ( $this->_is_required() || $this->_is_custom_check() ) {
			$this->save_error();
		}

		return $this->get_response();
	}

	public function init( $value, $block ) {
		$this->value = $value;
		$this->block = $block;

		$this->settings = $this->block['attrs'];
		$this->inner    = $this->block['innerBlocks'];

		if ( isset( $this->settings['required'] ) ) {
			$this->is_required = $this->settings['required'];
		}
		if ( isset( $this->settings['name'] ) ) {
			$this->name = $this->settings['name'];
		}
	}


	private function _is_required() {
		return ( $this->is_required && empty( $this->value ) );
	}

	private function save_error() {
		Error_Handler::instance()->add(
			$this->type(), array( 'name' => $this->name, 'params' => $this->settings )
		);
	}

	public function set_request_handler( $request_handler ) {
		$this->request_handler = $request_handler;
	}


}