![SchoolEvent Logo](./public/schoolevent_letter_logo_white.svg)

### SchoolEvent, the web application for managing and organizing school events.

# Features

**TODO: compete this section !!!**

# Tech stack

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [Ant Design](https://ant.design/) - A design system for enterprise-level products
- [LessCSS](https://lesscss.org/) - The dynamic stylesheet language
- [Phosphor Icons](https://phosphoricons.com/) - Flexible icons for everyone

# Installation

Before you begin, ensure you have [Node.js](https://nodejs.org/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed on your machine. We strongly recommend you to use VSCode as your IDE. Also, make sure to install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions for VSCode.

1.  Clone the repository:

    ```shell
    git clone git@github.com:SchoolEvent/schoolevent-client.git
    ```

2.  Change to the project directory:

    ```shell
    cd schoolevent
    ```

3.  Install dependencies:

    ```shell
    yarn install
    ```

4.  Start the development server:

    ```shell
    yarn dev
    ```

Open your web browser and navigate to http://localhost:5173 to access the SchoolEvent web app.

# Configuration

**TODO: Complete this section as you add environment variables.**

# Development rules

_Everything in this section is **mandatory**. If you don't follow these rules, your PR will be **rejected**._

### Branch naming

The branch name must be in the following format:

```shell
feat-<name>     # For new features
config-<name>   # For configuration changes
fix-<name>      # For any type of fixes
refactor-<name> # For refactoring
```

### Commit messages

Commit messages follows the same format as branch names. The commit message must be in the following format:

```shell
feat:     <message>    # For new features
config:   <message>    # For configuration changes
fix:      <message>    # For any type of fixes
refactor: <message>    # For refactoring
```

### Code structure

Any development happens in the `src` directory. The `assets` directory contains all the static assets. Components are placed in the `components` directory. Utils that can be shared accross the app are placed in the `utils` directory. Types that can be shared accross the app are placed in the `types` directory. Routes are placed in the `routes` directory.

```shell
src
 ├── assets
 │   └── ...
 ├── components
 │   └── ...
 ├── utils
 │   └── ...
 ├── types
 │   └── ...
 ├── routes
 │   └── ...
 ├── App.css
 ├── App.tsx
 ├── index.css
 ├── main.tsx
 └── ...
```

### Components

Components must follow the following folder structure:

```shell
components
 ├── MyComponent
 │   ├── MyComponent.tsx
 │   ├── MyComponent-styles.less
 │   ├── MyComponent-types.ts|tsx
 │   ├── MyComponent-utils.ts|tsx
 │   ├── MyComponent-constants.ts|tsx
 │   └── ...
 └── ...
```

- `MyComponent.tsx` is the component itself.
- `MyComponent-styles.less` contains the component styles.
- `MyComponent-types.ts|tsx` contains the component types.
- `MyComponent-utils.ts|tsx` contains the component utils.
- `MyComponent-constants.ts|tsx` contains the component constants.

A component **must be** exported the following way:

```tsx
export function MyComponent() {}
```

A component **must be** imported the following way:

```tsx
import { MyComponent } from './MyComponent'
```

### Types

Types must be prefixed with `T` and must be exported the following way:

```ts
export type TMyType = {}
```

Interfaces must be prefixed with `I` and must be exported the following way:

```ts
export interface IMyInterface {}
```

### Utils

There is only one util function per file (this doesn't applies to components utils files). Utils files from the `utils` directory must follow this naming convention:

```shell
<nameOfTheUtilFunction>.ts|tsx
```

If there are more than 2 parameters, they must be converted as an object:

```ts
// Bad ❌
export function myUtilFunction(param1: string, param2: string, param3: string) {}

// Good ✅
interface IMyUtilFunctionParams {
	param1: string
	param2: string
	param3: string
}

export function myUtilFunction(params: IMyUtilFunctionParams) {
	const { param1, param2, param3 } = params
}

// Good ✅
export function myUtilFunction(param: string) {}
```

## Icons

We uses Phosphor Icons. You can find all the icons [here](https://phosphoricons.com/).

You can import icons the following way:

```tsx
import { MyIcon } from '@phosphor-icons/react'
```
