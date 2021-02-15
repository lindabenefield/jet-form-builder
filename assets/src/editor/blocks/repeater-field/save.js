const block = 'jet-forms/repeater-field';
window.jetFormBuilderBlockCallbacks = window.jetFormBuilderBlockCallbacks || {};
window.jetFormBuilderBlockCallbacks[ block ] = window.jetFormBuilderBlockCallbacks[ block ] || {};

const { InnerBlocks } = wp.blockEditor ? wp.blockEditor : wp.editor;

export default function saveField( props ) {
	return <InnerBlocks.Content/>;
};
