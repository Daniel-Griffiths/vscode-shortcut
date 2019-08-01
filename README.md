# VSCode Clubhouse.io

A extension that adds Clubhouse.io integration with VSCode, the purpose of this extension is 
to use all the great features of Clubhouse without ever needing to leave the code editor. This means developers can spend more time coding, and less time moving/maintaining stories.

Some of the features of this extension include:

- Search for stories
- Branching stories
- Creating pull requests
- Creating commit's 

## Getting started

To use this extension you will need to provide a Clubhouse.io api key, you can generate one here https://app.clubhouse.io/hotsnapper/settings/account/api-tokens

This api key is stored locally in VSCode and is never shared with the outside world.

## Working on this extension

To compile this extension run the following command:

`yarn build`

To publish a new version run 

`vsce publish minor`