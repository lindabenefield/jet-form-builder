const { InnerBlocks } = wp.blockEditor ? wp.blockEditor : wp.editor;

export default function ( props ) {
	return <InnerBlocks.Content/>;
};
