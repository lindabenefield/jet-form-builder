<template>
	<div
		class="jfb-addons__item"
		:class="{ 'update-avaliable': updateActionAvaliable, 'activate-avaliable': activateActionAvaliable }"
	>
		<div
			class="jfb-addons__item-inner"
			:class="{ 'proccesing-state': proccesingState }"
		>
			<div class="jfb-addons__item-thumb">
				<img
					:src="addonData.thumb"
				>
			</div>
			<div class="jfb-addons__item-info">
				<div class="jfb-addons__item-name">
					<span class="label">{{ addonData.name }}</span>
					<span class="version">{{ addonData.currentVersion }}</span>
				</div>
				<div
					class="jfb-addons__item-update"
				>
					<div v-if="!updateActionAvaliable">Your plugin is up to date</div>
					<div v-if="updateActionAvaliable">
						Version <span class="latest-version">{{ addonData.version }}</span> available
						<cx-vui-button
							button-style="link-accent"
							size="link"
							:loading="updatePluginProcessed"
							@click="updatePlugin"
						>
							<span slot="label">
								<span>Update Now</span>
							</span>
						</cx-vui-button>
					</div>
				</div>
				<div class="jfb-addons__item-actions">
					<cx-vui-button
						class="cx-vui-button--style-default"
						button-style="link-accent"
						size="link"
						v-if="installActionAvaliable"
						:loading="actionPluginProcessed"
						@click="installPlugin"
					>
						<span slot="label">
							<span>Install Plugin</span>
						</span>
					</cx-vui-button>
					<cx-vui-button
						class="cx-vui-button--style-default"
						button-style="link-accent"
						size="link"
						:loading="actionPluginProcessed"
						v-if="activateActionAvaliable"
						@click="activatePlugin"
					>
						<span slot="label">
							<span>Activate Plugin</span>
						</span>
					</cx-vui-button>
					<cx-vui-button
						class="cx-vui-button--style-default"
						button-style="link-accent"
						size="link"
						:loading="actionPluginProcessed"
						v-if="deactivateActionAvaliable"
						@click="deactivatePlugin"
					>
						<span slot="label">
							<span>Deactivate Plugin</span>
						</span>
					</cx-vui-button>
				</div>
			</div>
		</div>

	</div>
</template>

<script>

export default {
	name: 'addon-item',
	props: {
		addonData: Object
	},
	data() {
		return {
			actionPlugin: false,
			actionPluginRequest: null,
			actionPluginProcessed: false,
			updatePluginProcessed: false,
		};
	},
	computed: {
		classList: function() {
			return [
				'jfb-addons__item',
				this.updateAvaliable ? 'update-avaliable' : false,
				this.activateAvaliable ? 'activate-avaliable' : false,
			];
		},

		installActionAvaliable: function() {
			return ( ! this.addonData['isInstalled'] ) ? true : false;
		},

		activateActionAvaliable: function() {
			return ( this.addonData['isInstalled'] && ! this.addonData['isActivated'] ) ? true : false;
		},

		deactivateActionAvaliable: function() {
			return ( this.addonData['isInstalled'] && this.addonData['isActivated'] ) ? true : false;
		},

		updateActionAvaliable: function() {
			return ( this.addonData['updateAvaliable'] ) ? true : false;
		},

		proccesingState: function() {
			return this.actionPluginProcessed || this.updatePluginProcessed;
		}

	},
	methods: {

		installPlugin: function() {
			this.actionPlugin = 'install';
			this.pluginAction();
		},

		deactivatePlugin: function() {
			this.actionPlugin = 'deactivate';
			this.pluginAction();
		},

		activatePlugin: function() {
			this.actionPlugin = 'activate';
			this.pluginAction();
		},

		updatePlugin: function() {

			if ( this.updateActionAvaliable ) {

				this.actionPlugin = 'update';
				this.pluginAction();
			}
		},

		pluginAction: function() {
			let self = this;

			self.actionPluginRequest = jQuery.ajax( {
				type: 'POST',
				url: window.JetFBPageConfig.ajaxUrl,
				dataType: 'json',
				data: {
					action: 'jet_fb_addon_action',
					data: {
						action: self.actionPlugin,
						plugin: self.addonData['slug']
					}
				},
				beforeSend: function( jqXHR, ajaxSettings ) {

					if ( null !== self.actionPluginRequest ) {
						self.actionPluginRequest.abort();
					}

					self.actionPluginProcessed = true;
				},
				success: function( responce, textStatus, jqXHR ) {

					self.actionPluginProcessed = false;

					if ( responce.success ) {
						self.$CXNotice.add( {
							message: responce.message,
							type: 'success',
							duration: 4000,
						} );

						window.jfbEventBus.$emit( 'updateAddonData', {
							'slug': self.addonData['slug'],
							'addonData': responce.data,
						} );
					} else {
						self.$CXNotice.add( {
							message: responce.message,
							type: 'error',
							duration: 4000,
						} );
					}
				}
			} );
		}
	},
}
</script>