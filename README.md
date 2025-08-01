# scratch-gui

```markdown
# 🐾 Virtual Pet Game — Rules & Mechanics

Welcome to the virtual pet simulator! Below are the gameplay mechanics, rules, and strategy guide for keeping your digital companion happy and healthy.

---

## 🎯 Pet Stats

| Stat         | Range  | Description                  |
|--------------|--------|------------------------------|
| **Hunger**   | 0–100  | 0 = Full, 100 = Starving     |
| **Cleanliness** | 0–100 | 0 = Dirty, 100 = Clean     |
| **Happiness**| 0–100  | 0 = Sad, 100 = Very Happy    |
| **Energy**   | 0–100  | 0 = Tired, 100 = Fully Rested|

---

## ⏳ Stat Decay (Every 20 Seconds)

| Stat           | Change     | Details                               |
|----------------|------------|----------------------------------------|
| **Hunger**     | +3         | Pet gets hungrier                     |
| **Cleanliness**| -2 / -10   | -10 if waste is present               |
| **Happiness**  | -1         | Pet gets slightly sadder              |
| **Energy**     | -1         | Pet gets slightly tired               |

---

## 🛠️ Actions & Effects

### 🍽️ Feed Pet  
- **Requires**: Energy ≥ 2 and 1 food item  
- **Effects**:
  - Hunger: -20  
  - Cleanliness: -5  
  - Energy: +5  
- **Reaction**: _"Yum! Thank you! 😋"_

---

### 🧸 Play with Pet  
- **Requires**: Energy ≥ 10 and Hunger ≤ 80  
- **Effects**:
  - Happiness: +20  
  - Hunger: +5  
  - Energy: -10  
  - Cleanliness: -10  
- **Reaction**: _"Yay! That was fun! 😺🎉"_

Update: user can play with pet by interacting with motion, sound, look: move 10 steps,.... it also increases happy.

---

### 🛁 Clean Pet  
- **Requires**: Energy ≥ 10  
- **Effects**:
  - Cleanliness: +10  
  - Energy: -10  
- **Reaction**: _"So fresh! 🛁✨"_

---

### 💤 Sleep  
- **Always Available**  
- **Duration**: 30 seconds  
- **Effects**:
  - Hunger: -5  
  - Energy: +4 per second (up to 100)  
- **Reaction**: _"Zzz... 😴"_

---

## 🍎 Food System

| Attribute     | Details                             |
|---------------|--------------------------------------|
| **Spawn Rate**| Every 20 seconds                    |
| **Types**     | 🍎 Apple, 🦴 Bone, 🐟 Fish           |
| **Lifespan**  | 5 seconds before disappearing        |
| **Collection**| Always available (no energy needed)  |
| **Storage**   | Unlimited                            |

---

## 💩 Waste System

| Attribute     | Details                                   |
|---------------|--------------------------------------------|
| **Spawn Rate**| Every 3 minutes (180 seconds)             |
| **Lifespan**  | Permanent until cleaned                   |
| **Requires**  | Energy ≥ 8                                |
| **Effect**    | Accelerates cleanliness decay when present|

---

## 💬 Speech Bubble Triggers

| Condition             | Message                     |
|-----------------------|-----------------------------|
| Hunger > 70           | _"I'm starving! 🍽️"_         |
| Cleanliness < 30      | _"I feel so dirty! 🛁"_       |
| Happiness < 40        | _"I'm so sad... 😢"_         |
| Energy < 20           | _"I'm so tired... 😴"_       |

---

## ⛔ Button Disable Rules

| Button        | Disabled If                            |
|---------------|-----------------------------------------|
| **Feed**      | Energy < 2                              |
| **Play**      | Energy < 10 or Hunger > 80              |
| **Clean**     | Energy < 10                             |
| **Sleep**     | ✅ Always enabled                        |
| **Collect Food**| ✅ Always enabled                     |
| **Clean Waste**| Energy < 8                             |

---

## 🔁 Game Flow Strategy

1. **Collect food** regularly — no energy required.
2. **Sleep** when energy is low.
3. **Feed** the pet when you have food and energy ≥ 2.
4. **Play** when hunger ≤ 80 and energy ≥ 10.
5. **Clean** the pet when energy ≥ 10.
6. **Remove waste** as soon as possible to avoid fast dirtiness.

---

## 🚨 Critical Situations

| Situation                   | Suggested Action                          |
|----------------------------|--------------------------------------------|
| Low Energy + High Hunger   | Sleep first → then feed                   |
| Waste Present              | Clean waste ASAP                          |
| Multiple Stats Are Low     | Prioritize energy recovery via sleep      |

---

> 💡 Tip: Keeping your pet balanced across all stats is the key to long-term happiness!

---

```



## **⚠️ NOTICE: Repository Migration to Mono-Repo ⚠️**

The Scratch Team has migrated the `scratch-gui` module into a new mono-repo,
[`scratch-editor`](https://github.com/scratchfoundation/scratch-editor). This independent `scratch-gui` repository
**will be archived**. Any new issues or pull requests should be opened in the mono-repo.

The new mono-repo version of `scratch-gui` is published to the NPM registry as
[`@scratch/scratch-gui`](https://www.npmjs.com/package/@scratch/scratch-gui).

**Contributors:**

* I would like to thank all past contributors for their work on this repository.
* If you are aware of valuable issues or pull requests, please consider re-opening them in the mono-repo. If you do
  so, please link the new issue or pull request to the original one in this repository to help others find it and to
  reduce the chance of duplicate work.
* We apologize for the inconvenience and greatly appreciate your help with this transition!

For more information, see the [`scratch-editor` repository on GitHub](https://github.com/scratchfoundation/scratch-editor).

## Overview

Scratch GUI is a set of React components that comprise the interface for creating and running Scratch 3.0 projects.

To open the current build in your browser on Github Pages:

<https://scratchfoundation.github.io/scratch-gui/>

## Installation

This requires you to have Git and Node.js installed.

In your own node environment/application:

```bash
npm install https://github.com/scratchfoundation/scratch-gui.git
```

If you want to edit/play yourself:

```bash
git clone https://github.com/scratchfoundation/scratch-gui.git
cd scratch-gui
npm install
```

**You may want to add `--depth=1` to the `git clone` command because there are some [large files in the git repository
history](https://github.com/scratchfoundation/scratch-gui/issues/5140).**

## Getting started

Running the project requires Node.js to be installed.

## Running

Open a Command Prompt or Terminal in the repository and run:

```bash
npm start
```

Then go to [http://localhost:8601/](http://localhost:8601/) - the playground outputs the default GUI component

## Developing alongside other Scratch repositories

### Getting another repo to point to this code

If you wish to develop `scratch-gui` alongside other scratch repositories that depend on it, you may wish
to have the other repositories use your local `scratch-gui` build instead of fetching the current production
version of the scratch-gui that is found by default using `npm install`.

Here's how to link your local `scratch-gui` code to another project's `node_modules/scratch-gui`.

#### Configuration

1. In your local `scratch-gui` repository's top level:
    1. Make sure you have run `npm install`
    2. Build the `dist` directory by running `BUILD_MODE=dist npm run build`
    3. Establish a link to this repository by running `npm link`

2. From the top level of each repository (such as `scratch-www`) that depends on `scratch-gui`:
    1. Make sure you have run `npm install`
    2. Run `npm link scratch-gui`
    3. Build or run the repository

#### Using `npm run watch`

Instead of `BUILD_MODE=dist npm run build`, you can use `BUILD_MODE=dist npm run watch` instead. This will watch for
changes to your `scratch-gui` code, and automatically rebuild when there are changes. Sometimes this has been
unreliable; if you are having problems, try going back to `BUILD_MODE=dist npm run build` until you resolve them.

#### Oh no! It didn't work

If you can't get linking to work right, try:

* Follow the recipe above step by step and don't change the order. It is especially important to run `npm install`
  _before_ `npm link` as installing after the linking will reset the linking.
* Make sure the repositories are siblings on your machine's file tree, like
  `.../.../MY_SCRATCH_DEV_DIRECTORY/scratch-gui/` and `.../.../MY_SCRATCH_DEV_DIRECTORY/scratch-www/`.
* Consistent node.js version: If you have multiple Terminal tabs or windows open for the different Scratch
  repositories, make sure to use the same node version in all of them.
* If nothing else works, unlink the repositories by running `npm unlink` in both, and start over.

## Testing

### Documentation

You may want to review the documentation for [Jest](https://facebook.github.io/jest/docs/en/api.html) and
[Enzyme](http://airbnb.io/enzyme/docs/api/) as you write your tests.

See [jest cli docs](https://facebook.github.io/jest/docs/en/cli.html#content) for more options.

### Running tests

_NOTE: If you're a Windows user, please run these scripts in Windows `cmd.exe`  instead of Git Bash/MINGW64._

Before running any tests, make sure you have run `npm install` from this (scratch-gui) repository's top level.

#### Main testing command

To run linter, unit tests, build, and integration tests, all at once:

```bash
npm test
```

#### Running unit tests

To run unit tests in isolation:

```bash
npm run test:unit
```

To run unit tests in watch mode (watches for code changes and continuously runs tests):

```bash
npm run test:unit -- --watch
```

You can run a single file of integration tests (in this example, the `button` tests):

```bash
$(npm bin)/jest --runInBand test/unit/components/button.test.jsx
```

#### Running integration tests

Integration tests use a headless browser to manipulate the actual HTML and javascript that the repo
produces. You will not see this activity (though you can hear it when sounds are played!).

To run the integration tests, you'll first need to install Chrome, Chromium, or a variant, along with Chromedriver.

Note that integration tests require you to first create a build that can be loaded in a browser:

```bash
npm run build
```

Then, you can run all integration tests:

```bash
npm run test:integration
```

Or, you can run a single file of integration tests (in this example, the `backpack` tests):

```bash
$(npm bin)/jest --runInBand test/integration/backpack.test.js
```

If you want to watch the browser as it runs the test, rather than running headless, use:

```bash
USE_HEADLESS=no $(npm bin)/jest --runInBand test/integration/backpack.test.js
```

## Troubleshooting

### Ignoring optional dependencies

When running `npm install`, you can get warnings about optional dependencies:

```text
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.2.7
```

You can suppress them by adding the `no-optional` switch:

```bash
npm install --no-optional
```

Further reading: [Stack Overflow](https://stackoverflow.com/questions/36725181/not-compatible-with-your-operating-system-or-architecture-fsevents1-0-11)

### Resolving dependencies

When installing for the first time, you can get warnings that need to be resolved:

```text
npm WARN eslint-config-scratch@5.0.0 requires a peer of babel-eslint@^8.0.1 but none was installed.
npm WARN eslint-config-scratch@5.0.0 requires a peer of eslint@^4.0 but none was installed.
npm WARN scratch-paint@0.2.0-prerelease.20190318170811 requires a peer of react-intl-redux@^0.7 but none was installed.
npm WARN scratch-paint@0.2.0-prerelease.20190318170811 requires a peer of react-responsive@^4 but none was installed.
```

You can check which versions are available:

```bash
npm view react-intl-redux@0.* version
```

You will need to install the required version:

```bash
npm install  --no-optional --save-dev react-intl-redux@^0.7
```

The dependency itself might have more missing dependencies, which will show up like this:

```bash
user@machine:~/sources/scratch/scratch-gui (491-translatable-library-objects)$ npm install  --no-optional --save-dev react-intl-redux@^0.7
scratch-gui@0.1.0 /media/cuideigin/Linux/sources/scratch/scratch-gui
├── react-intl-redux@0.7.0
└── UNMET PEER DEPENDENCY react-responsive@5.0.0
```

You will need to install those as well:

```bash
npm install  --no-optional --save-dev react-responsive@^5.0.0
```

Further reading: [Stack Overflow](https://stackoverflow.com/questions/46602286/npm-requires-a-peer-of-but-all-peers-are-in-package-json-and-node-modules)

## Publishing to GitHub Pages

You can publish the GUI to github.io so that others on the Internet can view it.
[Read the wiki for a step-by-step guide.](https://github.com/scratchfoundation/scratch-gui/wiki/Publishing-to-GitHub-Pages)

## Understanding the project state machine

Since so much code throughout scratch-gui depends on the state of the project, which goes through many different
phases of loading, displaying and saving, we created a "finite state machine" to make it clear which state it is in at
any moment. This is contained in the file src/reducers/project-state.js .

It can be hard to understand the code in src/reducers/project-state.js . There are several types of data and functions
used, which relate to each other:

### Loading states

These include state constant strings like:

* `NOT_LOADED` (the default state),
* `ERROR`,
* `FETCHING_WITH_ID`,
* `LOADING_VM_WITH_ID`,
* `REMIXING`,
* `SHOWING_WITH_ID`,
* `SHOWING_WITHOUT_ID`,
* etc.

### Transitions

These are names for the action which causes a state change. Some examples are:

* `START_FETCHING_NEW`,
* `DONE_FETCHING_WITH_ID`,
* `DONE_LOADING_VM_WITH_ID`,
* `SET_PROJECT_ID`,
* `START_AUTO_UPDATING`,

### How transitions relate to loading states

Like this diagram of the project state machine shows, various transition actions can move us from one loading state to
another:

![Project state diagram](docs/project_state_diagram.svg)

_Note: for clarity, the diagram above excludes states and transitions relating to error handling._

#### Example

Here's an example of how states transition.

Suppose a user clicks on a project, and the page starts to load with URL `https://scratch.mit.edu/projects/123456`.

Here's what will happen in the project state machine:

![Project state example](docs/project_state_example.png)

1. When the app first mounts, the project state is `NOT_LOADED`.
2. The `SET_PROJECT_ID` redux action is dispatched (from src/lib/project-fetcher-hoc.jsx), with `projectId` set to
   `123456`. This transitions the state from `NOT_LOADED` to `FETCHING_WITH_ID`.
3. The `FETCHING_WITH_ID` state. In src/lib/project-fetcher-hoc.jsx, the `projectId` value `123456` is used to request
   the data for that project from the server.
4. When the server responds with the data, src/lib/project-fetcher-hoc.jsx dispatches the `DONE_FETCHING_WITH_ID`
   action, with `projectData` set. This transitions the state from `FETCHING_WITH_ID` to `LOADING_VM_WITH_ID`.
5. The `LOADING_VM_WITH_ID` state. In src/lib/vm-manager-hoc.jsx, we load the `projectData` into Scratch's virtual
   machine ("the vm").
6. When loading is done, src/lib/vm-manager-hoc.jsx dispatches the `DONE_LOADING_VM_WITH_ID` action. This transitions
   the state from `LOADING_VM_WITH_ID` to `SHOWING_WITH_ID`.
7. The `SHOWING_WITH_ID` state. Now the project appears normally and is playable and editable.

## Donate

We provide [Scratch](https://scratch.mit.edu) free of charge, and want to keep it that way! Please consider making a
[donation](https://www.scratchfoundation.org/donate) to support our continued engineering, design, community, and
resource development efforts. Donations of any size are appreciated. Thank you!
