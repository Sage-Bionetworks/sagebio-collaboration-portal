# Welcome

This directory contains the configuration for integration with the Azure Active Directory (AD) managed and maintained by Roche.

## Define environment variables

You will need to have the following environment variables defined for single-sign-on (SSO) authentication to work against the Roche Azure Active Directory (AD) setup:

```sh
# Roche Azure AD
export ROCHE_AZURE_AD_IDENTITY_METADATA=
export ROCHE_AZURE_AD_CLIENT_ID=
export ROCHE_AZURE_AD_CLIENT_SECRET=
```

Please consult with your team and/or contacts at Roche for the appropriate credentials.

## Application configuration

Please review `server/config/environment/index.js` for details regarding the Roche configuration (currently identified as `rocheAzureAD`).

One important note is that the callback URL **MUST BE AN HTTPS address**.
