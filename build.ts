#! /usr/bin/env bun

import { readdir, readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

type IconSource = {
    className: string;
    componentName: string;
    content: string;
};

function kebabToPascalCase(str: string): string {
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

const iconToComponent = (icon: IconSource) => ({
    componentName: icon.componentName,
    fileName: `${icon.componentName}.svelte`,
    export: `export { default as ${icon.componentName} } from './${icon.componentName}.svelte';`,
    type: `export class ${icon.componentName} extends SvelteComponentTyped<{size?: string; strokeWidth?: number; class?: string}> {}`,
    componentContent: `<script>
    export let size = "24";
    export let strokeWidth = 2;
    let customClass = "";
    export { customClass as class };

    if (size !== "100%") {
        size = size.slice(-1) === 'x'
            ? size.slice(0, size.length - 1) + 'em'
            : parseInt(size) + 'px';
    }
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="{strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="feather ${icon.className} {customClass}">${icon.content}</svg>
`,
});

const getSvgContent = (svg: string) =>
    svg
        .slice(svg.indexOf(">") + 1, svg.lastIndexOf("<"))
        .replaceAll(' stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', "")
        .trim();

const assetDir = "assets";
const distDir = "dist";

if (!existsSync(distDir)) {
    await mkdir(distDir);
}

await readdir(distDir).then((fileNames) =>
    Promise.all(fileNames.map((fileName) => rm(`${distDir}/${fileName}`, { recursive: true })))
);

await readdir(assetDir)
    .then((fileNames) =>
        Promise.all(
            fileNames.map(async (fileName) => ({
                fileName,
                fileContent: await readFile(`${assetDir}/${fileName}`).then((b) => b.toString()),
            }))
        )
    )
    .then((files) =>
        files.map((file) => {
            const fileNameWithoutExtension = file.fileName.split(".").slice(0, -1).join("-");

            return {
                className: `untitled-icon-${fileNameWithoutExtension}`,
                componentName: `${kebabToPascalCase(fileNameWithoutExtension)}Icon`,
                content: getSvgContent(file.fileContent),
            };
        })
    )
    .then((icons) => icons.map(iconToComponent))
    .then((components) =>
        Promise.all(
            components.map(async (component) => {
                const componentDir = `${distDir}/${component.componentName}`;
                const typeFileContents = `/// <reference types="svelte" />\nimport { SvelteComponentTyped } from "svelte";\n${component.type}`;

                await mkdir(componentDir);
                await writeFile(`${componentDir}/index.d.ts`, typeFileContents);
                await writeFile(`${componentDir}/index.js`, component.export);
                await writeFile(`${componentDir}/${component.fileName}`, component.componentContent);
            })
        )
    );
