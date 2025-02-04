<?php
/**
 * next page button template
 */


$this->add_attribute( 'class', 'jet-form-builder__next-page' );
$this->add_attribute( 'class', $args['class_name'] );
$this->add_attribute( 'type', 'button' );
?>
<div class="jet-form-builder__next-page-wrap">
    <?php echo $this->render_disabled_message_form_break( $args ); ?>
	<?php include $this->get_global_template( 'common/prev-page-button.php' ); ?>
	<button<?php $this->render_attributes_string(); ?>><?php echo $args['label'] ? $args['label'] : 'Next'; ?></button>
</div>
<?php $this->reset_attributes(); ?>