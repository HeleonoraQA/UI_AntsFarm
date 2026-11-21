export type Ant = {
  id: string;
  name: string;
};

export type AntFarmData = {
  queen: { name: string };
  workers: Ant[];
  soldiers: Ant[];
  updatedAt: string;
};

export type AntFarmStats = {
  queenCount: 1;
  workersCount: number;
  soldiersCount: number;
  total: number;
};

export function getAntFarmStats(data: AntFarmData): AntFarmStats {
  const workersCount = data.workers.length;
  const soldiersCount = data.soldiers.length;
  return {
    queenCount: 1,
    workersCount,
    soldiersCount,
    total: 1 + workersCount + soldiersCount,
  };
}

export function createAntId(type: "worker" | "soldier"): string {
  const prefix = type === "worker" ? "w" : "s";
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
