"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import type { RootState } from "../store"
import { moveTask, saveToHistory } from "../store/boardSlice"
import type { Task } from "../types"
import Column from "./Column"
import TaskModal from "./TaskModal"
import FilterPanel from "./FilterPanel"
import { useLocalStorage } from "../hooks/useLocalStorage"

export default function KanbanBoard() {
  const dispatch = useDispatch()
  const { columns, columnOrder } = useSelector((state: RootState) => state.board)

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultColumnId, setDefaultColumnId] = useState<string>("")

  // Save to localStorage
  useLocalStorage()

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    dispatch(saveToHistory())
    dispatch(
      moveTask({
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      }),
    )
  }

  const handleAddTask = (columnId: string) => {
    setDefaultColumnId(columnId)
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDefaultColumnId("")
    setIsTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
    setDefaultColumnId("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Task Board</h1>
          <p className="text-gray-600">Organize and track your tasks across different stages</p>
        </div>

        <FilterPanel />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columnOrder.map((columnId) => {
              const column = columns[columnId]
              return <Column key={column.id} column={column} onAddTask={handleAddTask} onEditTask={handleEditTask} />
            })}
          </div>
        </DragDropContext>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          defaultColumnId={defaultColumnId}
        />
      </div>
    </div>
  )
}
