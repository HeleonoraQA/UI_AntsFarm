"use server";

import { revalidatePath } from "next/cache";
import { createAntId, type AntFarmData } from "@/lib/ant-farm";
import { readAntFarmData, writeAntFarmData } from "@/lib/ant-farm-store";

type ActionResult = { ok: true } | { ok: false; error: string };

function cleanName(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

async function save(data: AntFarmData) {
  await writeAntFarmData(data);
  revalidatePath("/");
}

export async function updateQueenNameAction(formData: FormData): Promise<ActionResult> {
  const name = cleanName(formData.get("name"));
  if (!name) return { ok: false, error: "Введите имя королевы." };
  const data = await readAntFarmData();
  data.queen.name = name;
  await save(data);
  return { ok: true };
}

export async function addAntAction(formData: FormData): Promise<ActionResult> {
  const name = cleanName(formData.get("name"));
  const type = cleanName(formData.get("type"));
  if (!name) return { ok: false, error: "Введите имя муравья." };
  if (type !== "worker" && type !== "soldier") {
    return { ok: false, error: "Выберите тип муравья." };
  }
  const data = await readAntFarmData();
  const ant = { id: createAntId(type), name };
  if (type === "worker") data.workers.push(ant);
  else data.soldiers.push(ant);
  await save(data);
  return { ok: true };
}

export async function removeAntAction(formData: FormData): Promise<ActionResult> {
  const id = cleanName(formData.get("id"));
  const type = cleanName(formData.get("type"));
  if (!id || (type !== "worker" && type !== "soldier")) {
    return { ok: false, error: "Некорректные данные." };
  }
  const data = await readAntFarmData();
  if (type === "worker") {
    data.workers = data.workers.filter((a) => a.id !== id);
  } else {
    data.soldiers = data.soldiers.filter((a) => a.id !== id);
  }
  await save(data);
  return { ok: true };
}

export async function renameAntAction(formData: FormData): Promise<ActionResult> {
  const id = cleanName(formData.get("id"));
  const type = cleanName(formData.get("type"));
  const name = cleanName(formData.get("name"));
  if (!id || (type !== "worker" && type !== "soldier")) {
    return { ok: false, error: "Некорректные данные." };
  }
  if (!name) return { ok: false, error: "Введите имя муравья." };
  const data = await readAntFarmData();
  const list = type === "worker" ? data.workers : data.soldiers;
  const ant = list.find((a) => a.id === id);
  if (!ant) return { ok: false, error: "Муравей не найден." };
  ant.name = name;
  await save(data);
  return { ok: true };
}
