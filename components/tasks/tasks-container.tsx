import { TaskCard } from "./task-card";

export function TasksContainer() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">
          <h1> My tasks </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button className="p-1.5 border border-app-border ">
            <span> Criar Novo </span>
          </button>

          <button className="p-1.5 border border-app-border bg-danger text-white">
            <span> Deletar </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border border-app-border">
        <div className="flex items-center justify-between p-3 border-b border-app-border">
          <div className="flex items-center gap-2">
            <div className="bg-transparent w-[0.9rem]"></div>

            <div className="flex justify-start">
              <span className="font-semibold text-sm"> Task </span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-sm"> Ações</span>
          </div>
        </div>

        <div className="flex flex-col">
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
        </div>
      </div>
    </div>
  );
}
