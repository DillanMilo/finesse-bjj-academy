# Competition banner video fallback — October 1, 2026

`public/videos/finesse-team-rolling-static.jpg` is the frame at 9.25 seconds of the existing 10-second montage, matched to the desktop banner screenshot the user selected. It is extracted from the real footage, without the screenshot's text or red tint; those remain page layers.

The video stays transparent until its `playing` event. The still remains visible while playback is blocked or unavailable, and for reduced-motion visitors. Pause, error, and emptied events return to the still.

Verified in the browser with the video request temporarily blocked, then restored to confirm normal playback. This simulates video unavailability; physical iPhone Low Power Mode was not tested.
