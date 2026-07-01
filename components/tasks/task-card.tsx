import { Task } from "@/types/task/task";
import Link from "next/link";


export function TaskCard() {
  return (
    <div className="flex items-center justify-between p-3 text-sm border-b border-app-border">
      <div className="flex items-center gap-2">
        <div>
          <input type="checkbox" />
        </div>

        <div className="flex flex-col">
          <Link href={'/teams/2/tasks/4'}>
            <div>
              <span className="font-semibold"> Task Name </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 text-xs">
            <span> Owner: </span>
            <span className="font-semibold"> John Doe </span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center gap-2 text-xs">
        <span> 23 de Julho, 2026 </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className="p-1.5 border border-app-border ">
          <button>[edit]</button>
        </div>

        <div>
          <button className="p-1.5 border border-app-border ">[delete]</button>
        </div>
      </div>
    </div>
  );
}
