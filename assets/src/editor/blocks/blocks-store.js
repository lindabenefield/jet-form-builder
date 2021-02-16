import BlockInstance from "./block-instance";

class BlocksStore {
	static registeredBlocks = {};

	static makeBlockName( name ) {
		return `jet-forms/${ name }`;
	}

	static add( blockInstance ) {
		if ( ! blockInstance instanceof BlockInstance ) {
			throw new Error( `The {blockInstance} is not instanceof BlockInstance` );
		} else if ( this.registeredBlocks[ blockInstance.blockName ] ) {
			throw new Error( `The ${ blockInstance.blockName } already defined` );
		}
		this.registeredBlocks[ blockInstance.blockName ] = blockInstance;
	}

	static getBlock( blockId ) {
		blockId = this.makeBlockName( blockId );

		return this.registeredBlocks[ blockId ] || false;
	}

	static parseAttributes( attrs ) {
		let responseAttrs = {};

		for ( const attrsKey in attrs ) {
			const block = this.getBlock( attrsKey );

			if ( block && 'inherit' === attrs[ attrsKey ] ) {
				responseAttrs = { ...block.settings.attributes, ...responseAttrs };
				continue;
			}
			responseAttrs[ attrsKey ] = attrs[ attrsKey ];
		}

		return responseAttrs;
	};

	static registerAll() {
		for ( const blockId in this.registeredBlocks ) {
			const blockInstance = this.registeredBlocks[ blockId ];

			blockInstance.register();
		}
	}

}

export default BlocksStore;