# Welcome

If you would like to explore using Azure Active Directory (AD) authentication with OpenID Connect (OIDC), you will need to configure your own Azure AD setup on the [Azure portal](https://portal.azure.com/).

## Configure Azure Active Directory (AD)

To create a new Azure AD application, simply click on the `+` symbol - `Create a resource`.

Find `Azure Active Directory` to create a new Azure AD resource:

+ `Organization name` - Use whatever you would like. This guide will use `rbtestazuread` as an example.
+ `Initial domain name` - Use whatever you would like. This guide will use `rbtestazuread` as an example; `rbtestazuread.onmicrosoft.com` will be auto-generated
+ `Create`

## Create a new app registration for Azure AD

Navigate to your newly created `Azure Active Directory` and find `App registrations` (located underneath the `Manage` section).

Click on `New registration` - this will be the application our `azuread-openidconnect` will authenticate against:

+ `Name` - This is a friendly display name for the application. This guide will use `[DEMO] Azure AD` as an example.
+ `Support account types` - If you would like to restrict users to this newly created Active Directory, the default option of `Accounts in this organizational directory only (rbtestazuread)` is fine.
  + If you would like to allow users defined in your Azure Active Directory - or any user with a Microsoft account - to authenticate, you may select `Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)`
+ `Redirect URI` - This must be an HTTPS address. If you have a dedicated HTTPS address - such as through using an [ngrok](https://ngrok.com/) tunnel to your locally running server - you can create a new `Web` redirect URI with a value of `https://some.example.com/auth/azuread-openidconnect/callback`
+ `Register`

## Define environment variables

Once you have created your Azure AD application, you will need to create the following environment variables:

```sh
export AZUREAD_OPENIDCONNECT_IDENTITY_METADATA=https://login.microsoftonline.com/0aeec3ea-a03d-4f3c-8161-58fc588c3611/v2.0/.well-known/openid-configuration
export AZUREAD_OPENIDCONNECT_CLIENT_ID=a93c6ff1-9d42-498b-93d0-ef8eccb2e6e7
```

`AZUREAD_OPENIDCONNECT_CLIENT_ID` will appear in the overview of your newly created app registration. Underneath `Display name` you will see `Application (client) ID` - this is the value you will want to use.

In the overview section of your newly created app registration, you will find an icon titled `Endpoints` - which will open a list of useful endpoints. Find the URL for the `OpenID Connect metadata document` and use this value for your `AZUREAD_OPENIDCONNECT_IDENTITY_METADATA` environment variable.

If you need to modify your current Redirect URI - or perhaps add several more - you may do so in the Redirect URIs section.
