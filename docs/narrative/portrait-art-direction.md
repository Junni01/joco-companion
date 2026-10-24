# Character Portrait Art Direction

**Status:** Approved visual direction, 24 October 2026.  
**Scope:** Future narrative portraits only. No implementation or asset-production approval.  
**Related:** [Narrative requirements](../narrative-requirements.md), [Narrative writing style](writing/style-guide.md).

## Chosen direction

Late-1990s Western PC strategy/RPG **small painted bitmap portraits**: vivid but controlled colour, strong individual faces, clear light and shade, tight square head-and-shoulders composition, modest background hints and visibly period-appropriate clothing. The intended feel is a hero-portrait icon from circa 1999 PC games, **not** a polished modern character illustration, not Japanese RPG/anime, and not coarse 8-bit block pixel art.

The user approved an iterative concept sheet featuring a fictional Indian ruler, East India Company officer and Company clerk in **neutral, angry, sad, triumphant and suspicious** expressions. The final refinement reduced high-resolution detail to approximately the visual information one would expect from a small painted bitmap (roughly 96–128 pixels square at its native effective size) while retaining expressive, recognisable faces.

## Portrait principles

- **Identity consistency:** A character is recognisable across every expression: face structure, age, hairstyle, facial hair, skin tone, costume and accessories remain stable. Expressions change; identities do not.
- **One age appearance set:** Do not require separate young/mature/elderly reaction matrices. Ageing can be conveyed in writing and character history; a later special visual revision is optional.
- **Emotion legibility:** Readable in the actual dialogue UI at approximately 80–100 displayed pixels. The baseline moods are neutral, angry, sad, triumphant and suspicious. Additional emotions may be considered only after testing.
- **Personality in expression:** Pride may be a restrained smile for one ruler and an absurd grin for a vain officer. Do not apply an identical facial template to every character.
- **Western PC bitmap finish:** Broader painterly colour groups, slightly softened/dithered edges and era-appropriate texture; avoid modern hyperrealistic skin, tiny costume filigree, glossy mobile-game rendering, anime eyes and conspicuous giant checkerboard pixels.
- **Historically grounded fictional cast:** Distinctive Indian rulers and Company personnel, with clothing and status cues appropriate to their roles. No ethnic caricature or fantasy/magical costume elements.
- **Background/UI restraint:** Small contextual colour/setting cues are acceptable (court, fort/port, office) but should not compete with the face or make the character unrecognisable at thumbnail size.
- **Anonymous chronicler:** The chronicler may remain without a portrait; a neutral icon/silhouette is sufficient.
- **Dynamic characters:** Long-term asset strategy should support numerous fictional rulers/dynasties and persistent Company advisers. A modular feature library may be explored later, but is not yet selected or required.

## Production and validation later

The current approved image is a **concept preview, not a shippable sprite sheet**. Do not cut the contact sheet into final UI assets. When portrait production is authorised, create individual character/expression portraits with consistent dimensions/background treatment, test at actual dialog size in the real application, and review identity consistency and emotion recognition before scaling to the cast.

The user-provided visual reference was used for *style inspiration* only. Do not copy existing game characters, costumes, layouts, insignia or other protected visual elements. Do not commit the user's reference image to this repository.

## Current milestone boundary

Collection 08A dialogue work proceeds separately. This document records a future art direction; it does not request portrait integration, new graphics generation or code changes now.
