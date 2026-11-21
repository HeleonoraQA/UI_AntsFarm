import { readAntFarmData } from "@/lib/ant-farm-store";
import { AntFarmDashboard } from "@/components/ant-farm/dashboard";

export const instant = false;

export default async function Home() {
  const data = await readAntFarmData();

  return <AntFarmDashboard data={data} />;
}
