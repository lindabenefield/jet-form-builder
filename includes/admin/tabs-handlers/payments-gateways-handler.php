<?php


namespace Jet_Form_Builder\Admin\Tabs_Handlers;


class Payments_Gateways_Handler extends Base_Handler {

	public function slug(): string {
		return 'payments-gateways';
	}

	public function on_get_request(): void {
		$use_gateways     = $_POST['use_gateways'] === 'true';
		$enable_test_mode = $_POST['enable_test_mode'] === 'true';

		$result = $this->update_options( array(
			'use_gateways'     => $use_gateways,
			'enable_test_mode' => $enable_test_mode,
		) );

		$result ? wp_send_json_success( array(
			'message' => __( 'Saved successfully!', 'jet-fom-builder' )
		) ) : wp_send_json_error( array(
			'message' => __( 'Unsuccessful save.', 'jet-form-builder' )
		) );
	}

	public function on_load(): array {
		return array_merge( array(
			'use_gateways'     => false,
			'enable_test_mode' => false,
		), $this->get_global_options() );
	}
}