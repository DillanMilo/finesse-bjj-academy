# Layered instructor portraits

Five portraits now pair the existing transparent coach PNGs with person-free background plates. Original source photos and cutouts are unchanged. Quotes remain preserved in a JSX comment marked to be decided.

Backgrounds were edited using the built-in image-generation tool, then resized and encoded to WebP. Assets: `public/photos/instructors/{luis,nathan,ty,patty,bodhi}-background.webp`.

The same prompt was applied separately to each corresponding original JPG:

> Use case: precise-object-edit. Input image is the edit target. Create a clean background plate for a layered instructor portrait: remove the entire person including all hair, skin, clothing and their shadow. Reconstruct the gym wall and floor naturally behind them. Preserve the original framing, aspect ratio, perspective, lighting, wall seams, visible flags, logos and photographer watermark. No people, no new objects, no new text. Only change the area occupied by the person. This is a background plate; do not include any silhouette or ghost of the removed person.

These are generated reconstructions of obscured backgrounds, not documentary originals. Coach appearance comes from the existing original cutouts.

LayeredPortrait uses opposing ±2% scroll transforms, a gradual 3.5% foreground scale, and a silhouette shadow. Percentage movement naturally decreases on narrow screens. CSS disables layer transforms for reduced-motion users without changing server-rendered markup. Backgrounds are decorative; each coach has one accessible image label.

Validation: ESLint and TypeScript pass. Chrome desktop and 390px mobile inspection; five portrait pairs rendered, no instructor blockquotes, no horizontal overflow, and no browser errors observed. Reduced-motion behavior is defined in CSS; OS preference was not changed for this review.

## Stronger lift revision

Increased foreground scale to 16%, foreground travel to +2% / -4%, and background travel to ±4%. The background frame starts 12% below the portrait top, with 25% headroom for the cutout and a stronger silhouette shadow. Added vertical spacing around portraits so the raised heads do not overlap headings or adjacent bios. Mobile and desktop previews inspected; lint and TypeScript pass.
