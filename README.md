# About

Advanced form builder plugin for Gutenberg. Create forms from the ground up, customize the existing ones, and style them up – all in one editor.

# ChangeLog

## 1.2.0
* ADD: Examples (preview) for Jet Form Fields in Gutenberg
* ADD: Global settings for actions, additional sidebar plugins, for example `reCAPTCHA v3`
* ADD: The ability to use global settings in `Mailchimp`, `GetResponse` & `ActiveCampaign` actions
* ADD: PHP action `jet-form-builder/render/{field_type}` to control the rendering of the field
* ADD: JS hook `jet.fb.register.fields.controls` for registering & manage block-fields controls
* ADD: JS hook `jet.fb.register.plugins` for registering custom sidebar-plugins
* ADD: JS hook `jet.fb.register.fields` for registering custom form fields
* Updated: `apiVersion:2` of blocks registration in Gutenberg

## 1.1.7
* ADD: RTL compatibility to Wysiwyg Field
* ADD: Compatibility with JetStyleManager 1.2.0 and older versions
* ADD: Styles for Form Progress circle
* FIX: Send email without correct headers, added initial padding-bottom for progress items
* FIX: Render script jet-form-builder-inputmask only when rendering Text Field
* FIX: Plain default value in repeater fields
* FIX: Wysiwyg field is RTL compliant
* FIX: Positioning of progress item label
* FIX: Rendering last form-break field in form

## 1.1.6
* ADD: `Label of progress` for Form Break Field
* FIX: Errors when editing actions such as MailChimp, GetResponse

## 1.1.5
* FIX: Trying to access array offset on value of type null on php 7.4
* FIX: Rendering repeater attributes

## 1.1.4
* FIX: CSS Compatibility with Twenty Twenty-One theme
* FIX: Parsing form fields from content when processing a request 

## 1.1.3
* FIX: Render Form Break button if there is no name for it, entering settings for Number Field with floating-point
* FIX: Render CSS classes in fields
* FIX: Initializing controls for widget Form in JetEngine
* FIX: Minor fixes in the editor

## 1.1.2
* FIX: Duplicating a plain preset in fields
* FIX: Applying macros to a message after paying with PayPal
* FIX: Retrieving form data after Paypal payment
* FIX: Styling Form-block with JetStyleManager
* FIX: Compatibility with Twenty Twenty-One theme
* FIX: Compatibility with JetEngine on initializing the conditions
* FIX: Saving character limitation in Text Field settings

## 1.1.1
* FIX: Wordpress 5.7 compatibility
* Improvement: Triggering conditional logic when typing in a text and textarea fields
 
## 1.1.0
* ADD: Gutenberg blocks: **Conditional Block**, **Datetime Field** 
* ADD: Elementor widget: **JetForm**
* ADD: Form Progress with multiple pages
* ADD: Post submit actions Conditions
* ADD: New preset sources for post-type: Post Date, Post Date GMT
* ADD: Integration with Paypal
* ADD: Compatibility with **JetEngine** widget Form
* ADD: Compatibility with **JetFormBuilder Converter**
* Improvement: The form builder and the form block full-width in the editor


## 1.0.4
* ADD: displaying a shortcode for each form

## 1.0.3
* FIX: creating a user with administrator role.

## 1.0.2
* Enhancement: added **`jet_fb_form`** shortcode. Example: 

`[jet_fb_form form_id="4338" submit_type="ajax" required_mark="***" fields_layout="row"]`

## 1.0.1
* FIX: render wysiwyg on front-end

## 1.0.0
* Initial release
