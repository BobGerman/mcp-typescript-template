import type { ResourceDefinition } from './resourceDefinition.ts';

export const secretMessageResource: ResourceDefinition = {
    name: 'echoSuggestions',
    uri: 'info://echoSuggestions',
    title: 'Echo Suggestions',
    description: 'A resource that contains suggestions for using the Echo tool.',
    text: 'Pretend you\'re in a big canyon and the message comes back more than once',
};
