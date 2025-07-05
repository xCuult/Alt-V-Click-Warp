import alt from "alt-client";
import native from "natives";

// credits: xCult

export function getCursorWorldPosition() {
  try {
    const cursorPos = alt.getCursorPos();
    if (!cursorPos) return null;

    const cameraPos = alt.getCamPos();
    if (!cameraPos) return null;

    const rayEndPos = alt.screenToWorld(cursorPos)
      .sub(cameraPos)
      .mul(1000)
      .add(cameraPos);

    const raycast = native.startExpensiveSynchronousShapeTestLosProbe(
      cameraPos.x, cameraPos.y, cameraPos.z,
      rayEndPos.x, rayEndPos.y, rayEndPos.z,
      511,
      alt.Player.local,
      4
    );

    const [hit, , endCoords] = native.getShapeTestResult(raycast);

    return hit ? endCoords : null;
  } catch (error) {
    alt.logError(`[CLICK WARP] Raycast Exception: ${error.message}`);
    return null;
  }
}

export function getSafeGroundZ(position) {
  try {
    const [found, groundZ] = native.getGroundZFor3dCoord(
      position.x,
      position.y,
      position.z,
      false,
      false
    );

    return found ? groundZ : null;
  } catch (error) {
    alt.logError(`[CLICK WARP] Ground Detection Exception: ${error.message}`);
    return null;
  }
}