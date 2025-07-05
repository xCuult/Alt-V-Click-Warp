import alt from 'alt-client';
import native from 'natives';
import { getCursorWorldPosition, getSafeGroundZ } from '../utils/RaycastUtils.js';

// credits: xCult

export class TeleportSystem {
    constructor() {
        this.isActive = false;
        this.activationKey = 19; // ALT key
        this.teleportKey = 0x01; // LMB
        this.lastTeleportTime = 0;
        this.teleportCooldown = 500;

        this.init();
    }

    init() {
        this.setupEventHandlers();
        this.startUpdateLoop();
    }

    setupEventHandlers() {
        alt.on('keyup', this.handleKeyUp.bind(this));
        alt.on('disconnect', this.cleanup.bind(this));
    }

    startUpdateLoop() {
        alt.everyTick(() => {
            this.update();
        })
    }

    update() {
        const isActivatioKeyPressed = native.isControlPressed(0, this.activationKey);

        if (isActivatioKeyPressed && !this.isActive) {
            this.activate();
        } else if (!isActivatioKeyPressed && this.isActive) {
            this.deactivate();
        }

        if (this.isActive) {
            this.handleActiveState();
        }
    }

    activate() {
        this.isActive = true;
        alt.showCursor(true);
    }

    deactivate() {
        this.isActive = false;
        alt.showCursor(false);
    }

    handleActiveState() {
        // Disable camera controls while cursor is showing
        const controlsToDisable = [1, 2, 3, 4]; // Mouse look controls
        controlsToDisable.forEach(control => {
            native.disableControlAction(0, control, true);
        })
    }

    handleKeyUp(key) {
        if (!this.isActive || key !== this.teleportKey) return;

        const currentTime = Date.now();
        if (currentTime - this.lastTeleportTime < this.teleportCooldown) return;

        this.performTeleport();
        this.lastTeleportTime = currentTime;
    }

    async performTeleport() {
        try {
            const worldPos = getCursorWorldPosition();
            if (!worldPos) return;

            const groundZ = getSafeGroundZ(worldPos);
            if (groundZ === null) return;

            const teleportPos = {
                x: worldPos.x,
                y: worldPos.y,
                z: groundZ + 1.0
            };

            native.setEntityCoordsNoOffset(
                alt.Player.local,
                teleportPos.x,
                teleportPos.y,
                teleportPos.z,
                false,
                false,
                false
            );

            this.deactivate();
        } catch (error) {
            alt.logError(`[CLICK WARP] Teleport Failed: ${error.message}`);
        }
    }

    cleanup() {
        if (this.isActive) {
            this.deactivate();
        }
    }

    setActivationKey(keyCode) {
        this.activationKey = keyCode;
    }

    setTeleportKey(keyCode) {
        this.teleportKey = keyCode;
    }

    setCooldown(ms) {
        this.teleportCooldown = ms;
    }
}