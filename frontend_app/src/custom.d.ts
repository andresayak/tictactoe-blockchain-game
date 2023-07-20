declare module "*.svg" {
    const content: any;
    export default content;
}
declare module "*.json" {
    const value: any;
    export default value;
}
declare const window: any;

declare global {
    namespace NodeJS {
        interface ProcessEnv {
        }
    }
}
