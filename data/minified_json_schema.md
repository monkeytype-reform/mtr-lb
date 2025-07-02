# Minified JSON Schema Documentation

## Overview

The minified JSON object is a minified representation of user typing statistics. Each key is a unique user handle, and its value is an **array of fixed index slots** representing user info and performance metrics in different typing test modes.

---

## Key Format

```js
{
  "<handle>": [
    UserInfo,
    PB15s,
    PB60s,
    PB10w
  ],
  ...
}
```

---

## Value Schema

Each value is an array with **4 elements**, ordered as follows:

| Index | Name       | Type                    | Description                                                                            |
| ----- | ---------- | ----------------------- | -------------------------------------------------------------------------------------- |
| 0     | `UserInfo` | `Array<number>`         | `[xp, level, timeTyping]` — User’s XP, derived level, and total typing time in seconds |
| 1     | `PB15s`    | `Array<number> \| null` | `[acc, consistency, wpm, raw]` for the 15-second test, or `null` if not available      |
| 2     | `PB60s`    | `Array<number> \| null` | `[acc, consistency, wpm, raw]` for the 60-second test, or `null` if not available      |
| 3     | `PB10w`    | `Array<number> \| null` | `[acc, consistency, wpm, raw]` for the 10-word test, or `null` if not available        |

---

## Example

```json
{
  "xyloflake": [
    [10345, 12, 293000],
    [98.5, 94.1, 112, 120],
    [97.0, 90.3, 108, 113],
    null
  ]
}
```

## Notes

* `acc` = Accuracy percentage
* `consistency` = Score representing typing consistency (0–100 scale)
* `wpm` = Words per minute
* `raw` = Raw WPM (without penalties for mistakes)
* A `null` value means no PB exists for that test mode (not attempted / unrecorded)
* Always ensure the array has exactly 4 elements (including `null`s where applicable) for compatibility

---

## Consumer Implementation Tips

* Always check for `null` before accessing mode data:

```js
const pb15 = dbMin[handle][1];
if (pb15) {
  const [acc, consistency, wpm, raw] = pb15;
  // use values...
}
```

* Avoid relying on key names (`"15s"`, `"60s"`, etc.) — this format is index-based for performance and size efficiency.

---
