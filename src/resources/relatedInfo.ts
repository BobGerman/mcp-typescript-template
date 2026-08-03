import type { ResourceDefinition } from './resourceDefinition.ts';

export const RelatedInfoResource: ResourceDefinition = {
    name: 'relatedInfo',
    uri: 'info://relatedInfo',
    title: 'Related Information',
    description: 'A resource that contains related information.',
    text: `
        This is a simple related information resource.
    `
};
