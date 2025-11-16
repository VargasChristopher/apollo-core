// lib/homeAssistantApi.ts

const HA_URL = "http://192.168.1.202:8123";

// TODO: rotate this token in Home Assistant and move it to env for real use
const HA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ZDM5MzZlZjA2NmE0YmE5ODBhNTk3YjM4MzliNGY3YyIsImlhdCI6MTc2MzI1NjY2NSwiZXhwIjoyMDc4NjE2NjY1fQ.fF-THR034aklcOstj4uDz-k6cAx3UDiTycWOMpc15sY";
const ENTITY_ID = "light.apollo";

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
      entity_id: ENTITY_ID,
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