const { InnerBlocks } = wp.blockEditor ? wp.blockEditor : wp.editor;

export default function saveField( props ) {
	return <InnerBlocks.Content/>;
};
