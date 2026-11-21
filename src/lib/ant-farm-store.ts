import { promises as fs } from "fs";
import path from "path";
import type { Ant, AntFarmData } from "./ant-farm";

const DATA_FILE = path.join(process.cwd(), "data.json");

const defaultData: AntFarmData = {
  queen: { name: "Королева" },
  workers: [],
  soldiers: [],
  updatedAt: new Date().toISOString(),
};

function normalizeData(raw: unknown): AntFarmData {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const queenName =
    typeof (obj.queen as { name?: unknown } | undefined)?.name === "string" &&
    (obj.queen as { name: string }).name.trim()
      ? (obj.queen as { name: string }).name.trim()
      : defaultData.queen.name;

  const normalizeAnts = (value: unknown, prefix: "w" | "s"): Ant[] => {
    if (!Array.isArray(value)) return [];
    return value
      .map((item, index) => {
        const rec = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        const name = typeof rec.name === "string" ? rec.name.trim() : "";
        if (!name) return null;
        const id =
          typeof rec.id === "string" && rec.id.trim() ? rec.id.trim() : `${prefix}-${index + 1}`;
        return { id, name } satisfies Ant;
      })
      .filter((a): a is Ant => a !== null);
  };

  const updatedAt =
    typeof obj.updatedAt === "string" && obj.updatedAt ? obj.updatedAt : new Date().toISOString();

  return {
    queen: { name: queenName },
    workers: normalizeAnts(obj.workers, "w"),
    soldiers: normalizeAnts(obj.soldiers, "s"),
    updatedAt,
  };
}

export async function readAntFarmData(): Promise<AntFarmData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return normalizeData(JSON.parse(raw));
  } catch {
    await writeAntFarmData(defaultData);
    return defaultData;
  }
}

export async function writeAntFarmData(data: AntFarmData): Promise<void> {
  const payload: AntFarmData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
}
