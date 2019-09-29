# VSCode Clubhouse.io

A extension that adds Clubhouse.io integration with VSCode, the purpose of this extension is 
to use all the great features of Clubhouse without ever needing to leave the code editor. This means developers can spend more time coding, and less time moving/maintaining stories.

## Missing Features

This plugin is a work in progress and is currently missing the following features

- Ability to create/edit stories

## Getting started

To use this extension you will need to provide a Clubhouse.io api key, you can generate one here https://app.clubhouse.io/hotsnapper/settings/account/api-tokens

This api key is stored locally in VSCode and is never shared with the outside world.

## Commands

| Command | Description |
|---|---|
| Set Token | Set the clubhouse.io api token, this is required to use this VSCode extension |
| Set Username | Set your cloubhouse.io username, this is used in conjunction with the `Get Stories` command, to get stories assigned to that username |
| Set Default Branch | Set's the default git branch, when new features branches are created/merged, they will use the default branch as the base |
| Get Stories| Get's stories assigned to the currently selected username (Set by the `Set Username` command) |
| Search Stories | Searches all stories in clubhouse.io, this supports all the search operators used in the main clubhouse app. [View the full list here](https://help.clubhouse.io/hc/en-us/articles/360000046646-Searching-in-Clubhouse-Story-Search) |
| Create Commit | Pushes a new commit to the feature branch, and automatically creates the feature branch on remote |
| Create Pull Request | Opens the "create pull request" page on github, automatically selects the current feature branch and prefills the title and description. Note: This will not automatically open the PR this just saves you filling in some of the info yourself |

## Working on this extension

To compile this extension run the following command:

`yarn build`

To publish a new version run 

`vsce publish minor`