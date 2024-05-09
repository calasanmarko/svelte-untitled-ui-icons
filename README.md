# svelte-untitled-ui-icons
*Untitled UI icon component library for Svelte*

## Installation
```bash
npm install --save-dev svelte-untitled-ui-icons
```
or
```bash
yarn add --dev svelte-untitled-ui-icons
```

## Usage
```svelte
<script>
    import { AlarmClockIcon } from "svelte-untitled-ui-icons/AlarmClockIcon";
</script>

<AlarmClockIcon
    size="32"
    strokeWidth={1}
/>
```

Exports are separated into subpaths because SvelteKit's dependency optimization would slow down page loading times on development builds to ~2-3 seconds if all exports were placed into the same file.

This causes auto-filling imports to be a little more inconvenient in IDEs, any suggestions on how this should be improved are welcome.

## Build
You can build this package using Bun
```bash
bun run build
```

or `tsx`
```
tsx build.ts
```

You can customize the icon selection by adding or removing icons from the `assets` directory. Make sure that filenames are in `kebab-case.svg`.

## Author

Made by **Marko Calasan**. Licensed under the **MIT License**.

All icons are created by [Untitled UI](https://www.untitledui.com).

Partially inspired by [svelte-feather-icons](https://github.com/dylanblokhuis/svelte-feather-icons) by [dylanblokhuis](https://github.com/dylanblokhuis).
