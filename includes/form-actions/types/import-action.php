<?php


namespace Jet_Form_Builder\Form_Actions\Types;


use Jet_Form_Builder\Form_Actions\Base_Form_Action;
use Jet_Form_Builder\Form_Actions\Import_Form_Trait;

class Import_Action extends Base_Form_Action {

    use Import_Form_Trait;

	public function __construct() {
		parent::__construct();

		add_action( 'admin_enqueue_scripts', array( $this, 'import_form_js' ) );
	}

	public function get_id() {
		return 'jet_fb_import';
	}

	public function get_title() {
		return __( 'Import Form', 'jet-form-builder' );
	}

	public function display_action_link() {
		return false;
	}

	public function do_admin_action() {
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_die( 'Acess denied', 'Error' );
		}

		$file = ! empty( $_FILES['form_file'] ) ? $_FILES['form_file'] : false;

		if ( ! $file ) {
			wp_die( 'File not found in request', 'Error' );
		}

		$type = $file['type'];

		if ( 'application/json' !== $type ) {
			wp_die( 'Incorrect file type', 'Error' );
		}

		if ( MB_IN_BYTES < $file['size'] ) {
			wp_die( 'File to large', 'Error' );
		}

		ob_start();
		include $file['tmp_name'];
		$content = ob_get_clean();

		unlink( $file['tmp_name'] );

		$content = json_decode( $content, true );

		if ( ! $content ) {
			wp_die( 'Incorrect file format', 'Error' );
		}

		$form_id = $this->import_form( $content );

		wp_redirect( get_edit_post_link( $form_id, 'url' ) );
		die();
	}

	public function import_form_js() {
		if ( ! jet_form_builder()->post_type->is_form_list_page() ) {
			return;
		}

		$import_button = __( 'Start Import', 'jet-form-builder' );

		ob_start();
		include $this->get_global_template( 'admin/import-form.php' );
		$import_template = ob_get_clean();

		ob_start();
		?>
        ( function( $ ) {
        console.log( $( '.page-title-action' ) );
            document.addEventListener( 'DOMContentLoaded', function() {
                var $newFormButton = $( '.page-title-action' );


                if ( $newFormButton.length ) {
                    $newFormButton.after( '<?= $import_template; ?>' );
                }
            });

            $( document ).on( 'click', '#<?= $this->get_id(); ?>-trigger', function() {
                $( '#<?= $this->get_id(); ?>' ).css( 'display', 'inline-flex' );
            } );

        }( jQuery ) );
		<?php

        $script = ob_get_clean();

		wp_add_inline_script( 'jquery', $script );
	}
}