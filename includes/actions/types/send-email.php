<?php

namespace Jet_Form_Builder\Actions\Types;

// If this file is called directly, abort.
use Jet_Form_Builder\Actions\Action_Handler;
use Jet_Form_Builder\Classes\Listing_Filter_Manager;
use Jet_Form_Builder\Classes\Tools;
use Jet_Form_Builder\Exceptions\Action_Exception;
use Jet_Form_Builder\Request\Request_Handler;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Define Base_Type class
 */
class Send_Email extends Base {

	private $data;
	private $filter;

	public function __construct() {
		parent::__construct();

		$this->filter = ( new Listing_Filter_Manager() )->manager;
	}

	public function get_name() {
		return __( 'Send Email', 'jet-form-builder' );
	}

	public function get_id() {
		return 'send_email';
	}

	public function visible_attributes_for_gateway_editor() {
		return array( 'mail_to', 'subject' );
	}

	public function self_script_name() {
		return 'jetFormEmailData';
	}

	public function editor_labels() {
		return array(
			'mail_to'          => __( 'Mail To:', 'jet-form-builder' ),
			'custom_email'     => __( 'Email Address:', 'jet-form-builder' ),
			'from_field'       => __( 'From Field:', 'jet-form-builder' ),
			'reply_to'         => __( 'Reply To:', 'jet-form-builder' ),
			'reply_to_email'   => __( 'Reply to Email Address:', 'jet-form-builder' ),
			'reply_from_field' => __( 'Reply To Email From Field:', 'jet-form-builder' ),
			'subject'          => __( 'Subject:', 'jet-form-builder' ),
			'from_name'        => __( 'From Name:', 'jet-form-builder' ),
			'from_address'     => __( 'From Email Address:', 'jet-form-builder' ),
			'content_type'     => __( 'Content type:', 'jet-form-builder' ),
			'content'          => __( 'Content:', 'jet-form-builder' ),
		);
	}

	public function action_attributes() {
		return array(
			'mail_to'          => array(
				'default' => '',
			),
			'custom_email'     => array(
				'default' => '',
			),
			'from_field'       => array(
				'default' => '',
			),
			'reply_to'         => array(
				'default' => '',
			),
			'reply_to_email'   => array(
				'default' => '',
			),
			'reply_from_field' => array(
				'default' => '',
			),
			'subject'          => array(
				'default' => '',
				'path'    => 'email/subject'
			),
			'from_name'        => array(
				'default' => '',
				'path'    => 'email/from_name'
			),
			'from_address'     => array(
				'default' => '',
				'path'    => 'email/from_address'
			),
			'content_type'     => array(
				'default' => '',
				'path'    => 'email/content_type'
			),
			'content'          => array(
				'default' => '',
				'path'    => 'email/content'
			),
		);
	}

	/**
	 * Regsiter custom action data for the editor
	 *
	 * @return [type] [description]
	 */
	public function action_data() {
		return array(
			'mailTo'       => Tools::with_placeholder( array(
				array(
					'value' => 'admin',
					'label' => __( 'Admin email', 'jet-form-builder' ),
				),
				array(
					'value' => 'form',
					'label' => __( 'Email from submitted form field', 'jet-form-builder' ),
				),
				array(
					'value' => 'custom',
					'label' => __( 'Custom email', 'jet-form-builder' ),
				),
			) ),
			'replyTo'      => Tools::with_placeholder( array(
				array(
					'value' => 'form',
					'label' => __( 'Email from submitted form field', 'jet-form-builder' ),
				),
				array(
					'value' => 'custom',
					'label' => __( 'Custom email', 'jet-form-builder' ),
				),
			) ),
			'content_type' => Tools::with_placeholder( array(
				array(
					'value' => 'text/plain',
					'label' => __( 'Plain text', 'jet-form-builder' ),
				),
				array(
					'value' => 'text/html',
					'label' => __( 'HTML', 'jet-form-builder' ),
				),
			) ),
			'customMacros' => apply_filters( 'jet-form-builder/actions/send-email/custom-macros', false )
		);
	}


	public function do_action( array $request, Action_Handler $handler ) {
		$this->data = $request;

		$mail_to     = ! empty( $this->settings['mail_to'] ) ? $this->settings['mail_to'] : 'admin';
		$reply_to    = ! empty( $this->settings['reply_to'] ) ? $this->settings['reply_to'] : 'form';
		$email       = false;
		$reply_email = false;


		switch ( $mail_to ) {
			case 'form':
				$field = ! empty( $this->settings['from_field'] ) ? $this->settings['from_field'] : '';

				if ( $field && ! empty( $this->data[ $field ] ) ) {
					$email = $this->data[ $field ];
				}

				break;

			case 'custom':
				$email = ! empty( $this->settings['custom_email'] ) ? $this->settings['custom_email'] : '';
				break;

			case 'admin':
			default:
				$email = get_option( 'admin_email' );
				break;
		}

		switch ( $reply_to ) {

			case 'form':
				$field = ! empty( $this->settings['reply_from_field'] ) ? $this->settings['reply_from_field'] : '';

				if ( $field && ! empty( $this->data[ $field ] ) ) {
					$this->settings['reply_email'] = $this->data[ $field ];
				}

				break;

			case 'custom':
				$this->settings['reply_email'] = ! empty( $this->settings['reply_to_email'] ) ? $this->settings['reply_to_email'] : '';
				break;
		}

		if ( ! $email || ! is_email( $email ) ) {
			throw new Action_Exception( 'invalid_email' );
		}


		$subject = ! empty( $this->settings['subject'] ) ? $this->settings['subject'] : sprintf(
			__( 'Form on %s Submitted', 'jet-form-builder' ),
			home_url( '' )
		);

		$message = ! empty( $this->settings['content'] ) ? apply_filters( 'jet-form-builder/send-email/message_content', $this->settings['content'], $this ) : '';

		$this->send_mail( $email, $subject, $message );
	}


	/**
	 * Send the email
	 *
	 * The To address to send to.
	 *
	 * @param $to
	 *
	 * The subject line of the email to send.
	 * @param $subject
	 *
	 * The body of the email to send.
	 * @param $message
	 *
	 * @return bool
	 * @throws Action_Exception
	 */
	public function send_mail( $to, $subject, $message ) {

		/**
		 * Hooks before the email is sent
		 */
		$this->send_before();
		do_action( 'jet-form-builder/send-email/send-before', $this );

		$content_type = $this->get_content_type();
		$subject      = $this->parse_macros( $subject );
		$message      = $this->parse_macros( $message );
		
		if ( 'text/html' === $content_type ) {
			$message = wpautop( $message );
			$message = make_clickable( $message );
		}

		$message = str_replace( '&#038;', '&amp;', $message );
		$sent    = wp_mail( $to, $subject, $message, $this->get_headers() );

		if ( ! $sent ) {
			throw new Action_Exception( 'failed', array(
				'to'      => $to,
				'subject' => $subject,
				'message' => $message,
				'headers' => $this->get_headers()
			) );
		}

		/**
		 * Hooks after the email is sent
		 *
		 * @since 2.1
		 */
		$this->send_after();
		do_action( 'jet-form-builder/send-email/send-after', $this );
	}

	/**
	 * Parse macros in content
	 *
	 * @param  [type] $content [description]
	 *
	 * @return [type]          [description]
	 */
	public function parse_macros( $content ) {

		return preg_replace_callback( '/%(.*?)(\|([a-zA-Z0-9\(\)_-]+))?%/', function ( $match ) {

			if ( isset( $this->data[ $match[1] ] ) ) {

				if ( ! empty( $match[3] ) ) {
					return $this->filter->apply_filters(
						$this->data[ $match[1] ], $match[3]
					);
				} else {
					if ( is_array( $this->data[ $match[1] ] ) ) {
						if ( ! empty( $this->data[ Request_Handler::REPEATERS_SETTINGS ][ $match[1] ] ) ) {
							return $this->verbose_repeater( $this->data[ $match[1] ] );
						} else {
							return implode( ', ', $this->data[ $match[1] ] );
						}
					} else {
						return $this->data[ $match[1] ];
					}
				}
			} else {
				return $match[0];
			}
		}, $content );

	}

	/**
	 * Verbose repeater items array
	 *
	 * @param array $items
	 *
	 * @return string
	 */
	public function verbose_repeater( $items = array() ) {

		$result = '';
		$index  = 1;

		foreach ( $items as $item ) {
			$item_data = array();

			foreach ( $item as $key => $value ) {
				$item_data[] = sprintf( '%1$s: %2$s', $key, $this->maybe_parse_if_array( $value ) );
			}
			$result .= $index ++ . ') ' . implode( ', ', $item_data ) . ';<br>';
		}

		return $result;

	}

	private function maybe_parse_if_array( $value ) {
		if ( is_array( $value ) ) {
			return implode( ', ', $value );
		}

		return $value;
	}


	/**
	 * Get the email headers
	 *
	 * @since 2.1
	 */
	public function get_headers() {
		$headers = "From: {$this->get_from_name()} <{$this->get_from_address()}>\r\n";
		$headers .= "Reply-To: {$this->get_reply_to()}\r\n";
		$headers .= "Content-Type: {$this->get_content_type()}; charset=utf-8\r\n";

		return apply_filters( 'jet-form-builder/send-email/headers', $headers, $this );
	}

	/**
	 * Add filters / actions before the email is sent
	 *
	 * @since 2.1
	 */
	public function send_before() {
		add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
		add_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );
		add_filter( 'wp_mail_content_type', array( $this, 'get_content_type' ) );
	}

	/**
	 * Remove filters / actions after the email is sent
	 *
	 * @since 2.1
	 */
	public function send_after() {
		remove_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
		remove_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );
		remove_filter( 'wp_mail_content_type', array( $this, 'get_content_type' ) );

		// Reset heading to an empty string
		$this->heading = '';
	}

	/**
	 * Get the email from name
	 */
	public function get_from_name() {
		$name = ! empty( $this->settings['from_name'] ) ? $this->settings['from_name'] : get_bloginfo( 'name' );

		return apply_filters( 'jet-form-builder/send-email/from-name', wp_specialchars_decode( $name ), $this );
	}

	/**
	 * Returns e-mail address to set into Reply-to email header
	 *
	 * @return [type] [description]
	 */
	public function get_reply_to() {

		$address = ! empty( $this->settings['reply_email'] ) ? $this->settings['reply_email'] : '';

		if ( empty( $address ) || ! is_email( $address ) ) {
			$address = $this->get_from_address();
		}

		return apply_filters( 'jet-form-builder/send-email/reply-to', $address, $this );

	}

	/**
	 * Get the email from address
	 */
	public function get_from_address() {

		$address = ! empty( $this->settings['from_address'] ) ? $this->settings['from_address'] : '';

		if ( empty( $address ) || ! is_email( $address ) ) {
			$address = get_option( 'admin_email' );
		}

		return apply_filters( 'jet-form-builder/send-email/from-address', $address, $this );
	}

	/**
	 * Get the email content type
	 */
	public function get_content_type() {

		$type = ! empty( $this->settings['content_type'] ) ? $this->settings['content_type'] : 'text/html';

		return apply_filters( 'jet-form-builder/send-email/content-type', $type, $this );
	}

}
