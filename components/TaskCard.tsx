"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "../types"
import { users } from "../data/users"
import { deleteTask, saveToHistory } from "../store/boardSlice"

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
}

const priorityColors = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
}

export default function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const assignee = users.find((user) => user.id === task.assigneeId)

  const handleDelete = () => {
    dispatch(saveToHistory())
    dispatch(deleteTask(task.id))
  }

  const handleEdit = () => {
    onEdit(task)
    setIsMenuOpen(false)
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
            snapshot.isDragging ? "shadow-lg rotate-2" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm leading-tight pr-2">{task.title}</h3>
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

            <div className="flex items-center justify-between">
              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>

              {assignee && (
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
