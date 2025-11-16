// lib/homeAssistantApi.ts

const HA_URL = "http://192.168.1.202:8123";
const HA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ZDM5MzZlZjA2NmE0YmE5ODBhNTk3YjM4MzliNGY3YyIsImlhdCI6MTc2MzI1NjY2NSwiZXhwIjoyMDc4NjE2NjY1fQ.fF-THR034aklcOstj4uDz-k6cAx3UDiTycWOMpc15sY";
const ENTITY_ID = "light.apollo";
const ENTITY_ID_2 = "light.apollo_2";
const ENTITY_ID_3 = "light.apollo_3";
const ENTITY_ID_4 = "light.apollo_4";

const ALL_ENTITIES = [ENTITY_ID, ENTITY_ID_2, ENTITY_ID_3, ENTITY_ID_4];

export type LightMode =
  | "on"
  | "off"
  | "focus"
  | "relax"
  | "night"
  | "energy";

async function callLightService(
  service: "turn_on" | "turn_off",
  extraBody: Record<string, unknown> = {}
) {
  const url = `${HA_URL}/api/services/light/${service}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entity_id: ALL_ENTITIES,
      ...extraBody,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HA ${service} failed: ${res.status} ${text}`);
  }
}

/**
 * Read the current state of the light from Home Assistant.
 * Returns "on" or "off".
 */
export async function getLightStatus(): Promise<LightMode> {
  const url = `${HA_URL}/api/states/${ENTITY_ID}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HA getLightStatus failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  // HA returns "on" or "off" in data.state
  return data.state === "on" ? "on" : "off";
}

/**
 * Read the current brightness (0-100) from Home Assistant for the light.
 * Returns null if brightness is not available.
 */
export async function getLightBrightness(): Promise<number | null> {
  const url = `${HA_URL}/api/states/${ENTITY_ID}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HA getLightBrightness failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  // Home Assistant reports brightness in attributes.brightness as 0-255
  const raw = (data?.attributes as any)?.brightness;
  if (typeof raw === 'number') {
    const percent = Math.round((raw / 255) * 100);
    return Math.max(0, Math.min(100, percent));
  }

  return null;
}

/**
 * Very simple mapping for now:
 * - "off" turns the light off
 * - everything else just turns it on
 * Later you can add brightness/color per mode here.
 */
export async function setLightMode(mode: LightMode): Promise<LightMode> {
  if (mode === "off") {
    await callLightService("turn_off");
  } else {
    await callLightService("turn_on");
  }
  return mode;
}

/**
 * Set brightness as percentage (0-100). This will call HA turn_on with a 0-255 brightness value.
 * If percent is 0 this will still call `turn_on` with brightness 0 which some integrations may treat specially.
 */
export async function setLightBrightness(percent: number): Promise<number> {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const brightness = Math.round((clamped / 100) * 255);

  await callLightService('turn_on', { brightness });

  return clamped;
}

/**
 * Turn on or off a specific individual light by index (0-3).
 */
export async function setIndividualLight(index: number, on: boolean): Promise<void> {
  if (index < 0 || index >= ALL_ENTITIES.length) {
    throw new Error(`Invalid light index: ${index}`);
  }

  const entityId = ALL_ENTITIES[index];
  const service = on ? "turn_on" : "turn_off";
  const url = `${HA_URL}/api/services/light/${service}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entity_id: entityId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HA ${service} failed for ${entityId}: ${res.status} ${text}`);
  }
}

/**
 * Get the state of all individual lights.
 * Returns an array of booleans indicating whether each light is on.
 */
export async function getAllLightStates(): Promise<boolean[]> {
  const promises = ALL_ENTITIES.map(async (entityId) => {
    const url = `${HA_URL}/api/states/${entityId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${HA_TOKEN}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HA getState failed for ${entityId}: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.state === "on";
  });

  return Promise.all(promises);
}