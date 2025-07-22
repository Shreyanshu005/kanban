"use client"

import { useSelector } from "react-redux"
import { Droppable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { RootState } from "../store"
import type { Column as ColumnType, Task } from "../types"
import TaskCard from "./TaskCard"

interface ColumnProps {
  column: ColumnType
  onAddTask: (columnId: string) => void
  onEditTask: (task: Task) => void
}

export default function Column({ column, onAddTask, onEditTask }: ColumnProps) {
  const { tasks, filters } = useSelector((state: RootState) => state.board)

  const columnTasks = column.taskIds
    .map((taskId) => tasks[taskId])
    .filter((task) => {
      if (!task) return false

      // Apply filters
      if (filters.assignee && task.assigneeId !== filters.assignee) {
        return false
      }

      if (filters.priority && task.priority !== filters.priority) {
        return false
      }

      return true
    })

  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className={`pb-3 ${column.color} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {column.title}
            <Badge variant="secondary" className="text-xs">
              {columnTasks.length}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onAddTask(column.id)} className="h-6 w-6 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-muted/50 rounded-md" : ""}`}
            >
              {columnTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onEdit={onEditTask} />
              ))}
              {provided.placeholder}

              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {filters.assignee || filters.priority ? "No matching tasks" : "No tasks yet"}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
