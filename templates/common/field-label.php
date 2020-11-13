<?php
/**
 * Field label template
 */

if ( isset( $args['type'] ) && 'heading' === $args['type'] ) {
	$class = 'jet-form__heading';
} else {
	$class = 'jet-form__label';
}

if ( ! empty( $this->args['label_tag'] ) && 'label' === $this->args['label_tag'] ) {
	$tag = 'label';
	$for = 'for="' . $this->get_field_id( $args ) . '"';
} else {
	$tag = 'span';
	$for = '';
}

?>
<div class="<?php echo $class; ?>">
	<<?php echo $tag; ?> class="jet-form__label-text" <?php echo $for; ?>><?php
	echo $args['label'];

	if ( $this->get_required_val( $args ) && ! empty( $this->args['required_mark'] ) ) {
		printf( '<span class="jet-form__required">%s</span>', $this->args['required_mark'] );
	}

	?></<?php echo $tag; ?>>
	<?php include $this->get_template( 'common/prev-page-button.php' ); ?>
</div>