declare module '*.scss' {
    const content: { [className: string]: string };
    export = content;
}

declare module "*.css" {
    const content: any;
    export default content;
}