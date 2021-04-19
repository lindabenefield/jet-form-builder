import { labels } from "./options";

const { __ } = wp.i18n;
const { useMetaState } = JetFBHooks;
const {
	ToggleControl,
	TextControl,
} = wp.components;

function PluginCaptcha() {

	const [ args, setArgs ] = useMetaState( '_jf_recaptcha' );

	return <>
		<ToggleControl
			key={ 'enabled' }
			label={ labels.enabled }
			checked={ args.enabled }
			onChange={ newVal => {
				setArgs( ( prevArgs ) => ( {
					...prevArgs,
					enabled: Boolean( newVal )
				} ) );
			} }
		/>
		<ToggleControl
			key={ 'use_global' }
			label={ labels.use_global }
			checked={ args.use_global }
			onChange={ use_global => {
				setArgs( prevArgs => ( {
					...prevArgs,
					use_global: Boolean( use_global )
				} ) );
			} }
		/>
		{ args.enabled && <>
			<TextControl
				key={ 'site_key' }
				label={ labels.key }
				value={ args.key }
				disabled={ args.use_global }
				onChange={ newValue => setArgs( ( prevArgs ) => ( {
					...prevArgs,
					key: newValue
				} ) ) }
			/>
			<TextControl
				key={ 'secret_key' }
				label={ labels.secret }
				value={ args.secret }
				disabled={ args.use_global }
				onChange={ newValue => setArgs( ( prevArgs ) => ( {
					...prevArgs,
					secret: newValue
				} ) ) }
			/>
			<span>{ 'Register reCAPTCHA v3 keys ' }
				<a href="https://www.google.com/recaptcha/admin/create" target="_blank">here</a>
					</span>
		</> }
	</>
}


export default PluginCaptcha;
