# Missing icons

`msr-icons@1.1.0` has 2122 icons and covered nearly everything. The names below
had **no clean/plain export**, so a close alias is used today (see
`src/lib/icons.tsx`). Adding the plain-named aliases upstream would tidy DX.

| Wanted name | Used by | Alias in use | Notes |
| --- | --- | --- | --- |
| `Activity` | dashboard (ActivityTimeline, MetricCard) | `Pulse` | No `Activity`/`activity-*` icon exists. |
| `Plus` | FloatingActionButton, QuickActions | `CirclePlus` | Only `CirclePlus` / `BaseIconPlusSign` exist; no plain `Plus`. |
| `Minus` | steppers | `CircleMinus` | No plain `Minus`. |
| `Download` | ReportExportToolbar | `FileDownload` | No plain `Download` (only `*Download` variants). |
| `Upload` | QuickActions | `CloudUpload` | No plain `Upload`. |
| `Copy` | CopyableCodeBlock | `ClipboardCopy` | No plain `Copy` (collides with copyright icons). |
| `Filter` | DataTable | `Adjust` | Only `FilterCheck/Plus/X`; no neutral `Filter`. |
| `Battery` | DogTrackerMapCard | `Battery2` | Plain `Battery` absent; `Battery2` family present. |
| `Dog` | pets module | `ServiceDog` / `Paw` | No plain `Dog`. |
| `Flag` | game module | `Flag2` | No plain `Flag` (only `Flag2`, `FlagCheckered`, `BaseIconFlag`). |
| `Command` | CommandPalette | `CommandMenu` | Plain `Command` absent. |
| `MoreVertical` / `MoreHorizontal` | menus | `MoreVertical2` / `MoreHorizontal2` | Plain (non-`2`) names absent. |
| `PlayCircle` | RoutineTimeline | `PlayCircle2` | Plain `PlayCircle` absent. |
