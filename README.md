# A simple system by which you can teleport by cursor position in the game world

Demonstration: https://streamable.com/5zvsxy

# Project Structure
```bash
src/
├── main.js                 // Entry point
├── systems/
│   └── TeleportSystem.js   // Main teleport system class
└── utils/
    └── RaycastUtils.js     // Raycast and ground detection
```

 # Controls
 | Key | Action |
 |--- | ---|
 | ALT (Hold) | Activate cursor for teleporting |
 | LMB | Teleport to cursor position |
 | Release ALT | Hide cursor |
