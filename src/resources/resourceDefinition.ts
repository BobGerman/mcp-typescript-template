// Currently supports only static text resources.

export interface ResourceDefinition {
    name: string;
    uri: string;
    title: string;
    description: string;
    mimeType?: string;
    text: string;
}