<?php


namespace Jet_Form_Builder\Admin\Tabs_Handlers;


class Captcha_Handler extends Base_Handler {

	public function slug(): string {
		return 'captcha-tab';
	}

	public function on_get_request(): void {
		$secret = sanitize_text_field( $_POST['secret'] );
		$key   = sanitize_text_field( $_POST['key'] );

		$result = $this->update_options( array(
			'secret' => $secret,
			'key'   => $key
		) );

		$result ? wp_send_json_success( array(
			'message' => __( 'Saved successfully!', 'jet-fom-builder' )
		) ) : wp_send_json_error( array(
			'message' => __( 'Unsuccessful save.', 'jet-form-builder' )
		) );
	}

	public function on_load(): array {
		return $this->get_options( array(
			'key'   => '',
			'secret' => ''
		) );
	}
}