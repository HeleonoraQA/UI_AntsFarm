"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Crown,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Users,
  Pickaxe,
} from "lucide-react";
import type { Ant, AntFarmData } from "@/lib/ant-farm";
import { getAntFarmStats } from "@/lib/ant-farm";
import {
  addAntAction,
  removeAntAction,
  renameAntAction,
  updateQueenNameAction,
} from "@/app/actions";
import Footer from "@/components/footer-2";
import { QueenAnt } from "@/components/ant-farm/queen-ant";
import { StaticAntColony } from "@/components/ant-farm/static-ants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type AntType = "worker" | "soldier";

function typeLabel(type: AntType) {
  return type === "worker" ? "Рабочий" : "Солдат";
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="relative items-center text-center">
        <div className="absolute right-6 top-6 text-muted-foreground">{icon}</div>
        <div className="flex flex-col items-center gap-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl">{value}</CardTitle>
        </div>
      </CardHeader>
      {description ? (
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

function CountUpNumber({
  value,
  duration = 1000,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => (value <= 1 ? value : 1));

  useEffect(() => {
    if (value <= 1) {
      setDisplay(value);
      return;
    }

    if (typeof window !== "undefined") {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduceMotion.matches) {
        setDisplay(value);
        return;
      }
    }

    setDisplay(1);
    const startTime = Date.now();
    const intervalId = window.setInterval(() => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const current = Math.round(1 + (value - 1) * progress);
      setDisplay(current);
      if (progress >= 1) {
        window.clearInterval(intervalId);
      }
    }, 32);

    return () => window.clearInterval(intervalId);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}

function QueenEditor({ currentName }: { currentName: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil data-icon="inline-start" />
        Изменить имя
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Имя королевы</DialogTitle>
          <DialogDescription>
            На ферме может быть только одна королева. Укажите её имя.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              const result = await updateQueenNameAction(formData);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Имя королевы обновлено");
              setOpen(false);
            });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="queen-name">Имя</FieldLabel>
              <Input
                id="queen-name"
                name="name"
                defaultValue={currentName}
                placeholder="Например, Королева Августа"
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter showCloseButton>
            <Button type="submit" disabled={pending}>
              {pending ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RenameAntDialog({ ant, type }: { ant: Ant; type: AntType }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Pencil />
        <span className="sr-only">Переименовать</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Переименовать муравья</DialogTitle>
          <DialogDescription>
            {typeLabel(type)}: измените имя и сохраните изменения.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.set("id", ant.id);
            formData.set("type", type);
            startTransition(async () => {
              const result = await renameAntAction(formData);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Имя обновлено");
              setOpen(false);
            });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`rename-${ant.id}`}>Имя</FieldLabel>
              <Input id={`rename-${ant.id}`} name="name" defaultValue={ant.name} required />
            </Field>
          </FieldGroup>
          <DialogFooter showCloseButton>
            <Button type="submit" disabled={pending}>
              {pending ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RemoveAntButton({ ant, type }: { ant: Ant; type: AntType }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Trash2 />
        <span className="sr-only">Удалить</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить муравья?</AlertDialogTitle>
          <AlertDialogDescription>
            «{ant.name}» ({typeLabel(type).toLowerCase()}) будет удалён из колонии. Численность пересчитается автоматически.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.set("id", ant.id);
              formData.set("type", type);
              startTransition(async () => {
                const result = await removeAntAction(formData);
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Муравей удалён");
                setOpen(false);
              });
            }}
            disabled={pending}
          >
            {pending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AntList({
  items,
  emptyType,
}: {
  items: { ant: Ant; type: AntType }[];
  emptyType?: AntType | "all";
}) {
  if (items.length === 0) {
    const isWorker = emptyType === "worker";
    const isSoldier = emptyType === "soldier";
    const title =
      isWorker || isSoldier || emptyType === "all"
        ? "Пока никого нет"
        : "Пока никого нет";
    const description = isWorker
      ? "Добавьте рабочих в блоке «Управление колонией»."
      : isSoldier
        ? "Добавьте солдат в блоке «Управление колонией»."
        : "Добавьте муравьёв в блоке «Управление колонией».";

    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {isSoldier ? <Shield /> : isWorker ? <Pickaxe /> : <Users />}
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-[360px] rounded-lg border bg-card">
      <Table className="bg-transparent text-foreground">
        <TableHeader className="bg-transparent [&_tr]:bg-transparent">
          <TableRow className="bg-transparent hover:bg-transparent">
            <TableHead className="text-foreground">Имя</TableHead>
            <TableHead className="text-foreground">Тип</TableHead>
            <TableHead className="text-right text-foreground">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-transparent [&_tr]:bg-transparent">
          {items.map(({ ant, type }) => (
            <TableRow key={ant.id} className="bg-transparent hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">{ant.name}</TableCell>
              <TableCell className="font-medium text-foreground">
                {typeLabel(type)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <RenameAntDialog ant={ant} type={type} />
                  <RemoveAntButton ant={ant} type={type} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function AddAntForm() {
  const [type, setType] = useState<AntType>("soldier");
  const [pending, startTransition] = useTransition();

  return (
    <Card id="manage">
      <CardHeader>
        <CardTitle>Управление колонией</CardTitle>
        <CardDescription>
          Добавляйте муравьёв и задавайте им имена.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            formData.set("type", type);
            startTransition(async () => {
              const result = await addAntAction(formData);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success(`${typeLabel(type)} добавлен`);
              form.reset();
              setType("soldier");
            });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Тип муравья</FieldLabel>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={type === "soldier" ? "default" : "outline"}
                  aria-pressed={type === "soldier"}
                  onClick={() => setType("soldier")}
                >
                  <Shield data-icon="inline-start" />
                  Солдат
                </Button>
                <Button
                  type="button"
                  variant={type === "worker" ? "default" : "outline"}
                  aria-pressed={type === "worker"}
                  onClick={() => setType("worker")}
                >
                  <Pickaxe data-icon="inline-start" />
                  Рабочий
                </Button>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="ant-name">Имя муравья</FieldLabel>
              <Input id="ant-name" name="name" placeholder="Например, Искатель" required />
            </Field>
          </FieldGroup>
          <div>
            <Button type="submit" disabled={pending}>
              <Plus data-icon="inline-start" />
              {pending ? "Добавление..." : "Добавить муравья"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function AntFarmDashboard({ data }: { data: AntFarmData }) {
  const stats = useMemo(() => getAntFarmStats(data), [data]);

  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Hero */}
        <section className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Живая колония</Badge>
          </div>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <QueenAnt className="h-24 w-auto sm:h-28 lg:h-32" />
            <StaticAntColony soldiers={data.soldiers} workers={data.workers} />
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Муравьиная ферма
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Наблюдайте за колонией, следите за численностью и управляйте составом фермы:
                одна королева, солдаты и рабочие — каждый со своим именем.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-muted/30 p-6 text-center sm:min-w-[260px] sm:p-8 lg:self-center">
              <span className="text-base text-muted-foreground">Сейчас на ферме</span>
              <CountUpNumber
                value={stats.total}
                className="text-5xl font-semibold leading-none text-primary sm:text-6xl"
              />
              <span className="text-base text-muted-foreground">всего муравьёв</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#colony">
              <Button>
                <Users data-icon="inline-start" />
                Посмотреть колонию
              </Button>
            </a>
            <a href="#manage">
              <Button variant="outline">
                <Plus data-icon="inline-start" />
                Добавить муравья
              </Button>
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Королева"
            value={stats.queenCount}
            description=""
            icon={<Crown className="size-5" />}
          />
          <StatCard
            title="Солдаты"
            value={stats.soldiersCount}
            description=""
            icon={<Shield className="size-5" />}
          />
          <StatCard
            title="Рабочие"
            value={stats.workersCount}
            description=""
            icon={<Pickaxe className="size-5" />}
          />
        </section>

        {/* Queen & management */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback>
                      <Crown className="queen-crown-glow size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <CardDescription>Королева фермы</CardDescription>
                    <CardTitle className="text-2xl">{data.queen.name}</CardTitle>
                  </div>
                </div>
                <Badge>1 особь</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Королева — единственная на ферме. Она определяет жизнь колонии, а солдаты и рабочие поддерживают её развитие и защиту.
              </p>
              <div>
                <QueenEditor currentName={data.queen.name} />
              </div>
            </CardContent>
          </Card>
  
          <AddAntForm />
        </section>
  
        {/* Colony */}
        <section id="colony" className="flex flex-col gap-4 text-foreground">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Колония</h2>
            <p className="text-sm text-muted-foreground">
              Список муравьёв на ферме по типам. Имена и состав можно изменять, а численность обновляется автоматически.
            </p>
          </div>
          <Tabs defaultValue="all" className="text-foreground">
            <TabsList variant="line" className="h-auto w-full justify-start gap-2 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="h-9 flex-none rounded-md border border-border bg-background px-4 py-2 text-foreground! opacity-100 shadow-none after:hidden hover:bg-muted hover:text-foreground! dark:border-input dark:bg-input/30 dark:text-foreground! dark:hover:bg-input/50 dark:hover:text-foreground! data-active:border-transparent data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-none data-active:hover:bg-primary/90! data-active:hover:text-primary-foreground! dark:data-active:bg-primary! dark:data-active:text-primary-foreground!"
              >
                <Users data-icon="inline-start" />
                Все{" "}
                <Badge
                  variant="secondary"
                  className="border-transparent bg-secondary text-secondary-foreground in-data-active:bg-primary-foreground/20 in-data-active:text-primary-foreground"
                >
                  {stats.workersCount + stats.soldiersCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="soldiers"
                className="h-9 flex-none rounded-md border border-border bg-background px-4 py-2 text-foreground! opacity-100 shadow-none after:hidden hover:bg-muted hover:text-foreground! dark:border-input dark:bg-input/30 dark:text-foreground! dark:hover:bg-input/50 dark:hover:text-foreground! data-active:border-transparent data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-none data-active:hover:bg-primary/90! data-active:hover:text-primary-foreground! dark:data-active:bg-primary! dark:data-active:text-primary-foreground!"
              >
                <Shield data-icon="inline-start" />
                Солдаты{" "}
                <Badge
                  variant="secondary"
                  className="border-transparent bg-secondary text-secondary-foreground in-data-active:bg-primary-foreground/20 in-data-active:text-primary-foreground"
                >
                  {stats.soldiersCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="workers"
                className="h-9 flex-none rounded-md border border-border bg-background px-4 py-2 text-foreground! opacity-100 shadow-none after:hidden hover:bg-muted hover:text-foreground! dark:border-input dark:bg-input/30 dark:text-foreground! dark:hover:bg-input/50 dark:hover:text-foreground! data-active:border-transparent data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-none data-active:hover:bg-primary/90! data-active:hover:text-primary-foreground! dark:data-active:bg-primary! dark:data-active:text-primary-foreground!"
              >
                <Pickaxe data-icon="inline-start" />
                Рабочие{" "}
                <Badge
                  variant="secondary"
                  className="border-transparent bg-secondary text-secondary-foreground in-data-active:bg-primary-foreground/20 in-data-active:text-primary-foreground"
                >
                  {stats.workersCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <AntList
                items={[
                  ...data.soldiers.map((ant) => ({ ant, type: "soldier" as const })),
                  ...data.workers.map((ant) => ({ ant, type: "worker" as const })),
                ]}
                emptyType="all"
              />
            </TabsContent>
            <TabsContent value="soldiers" className="pt-4">
              <AntList
                items={data.soldiers.map((ant) => ({ ant, type: "soldier" as const }))}
                emptyType="soldier"
              />
            </TabsContent>
            <TabsContent value="workers" className="pt-4">
              <AntList
                items={data.workers.map((ant) => ({ ant, type: "worker" as const }))}
                emptyType="worker"
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </>
  );
}
