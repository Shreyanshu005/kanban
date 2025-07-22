import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BoardState, Task, Column, FilterState } from "../types"

const initialColumns: Record<string, Column> = {
  todo: {
    id: "todo",
    title: "Todo",
    taskIds: ["task-1", "task-2"],
    color: "bg-slate-100",
  },
  "in-progress": {
    id: "in-progress",
    title: "In Progress",
    taskIds: ["task-3"],
    color: "bg-blue-100",
  },
  done: {
    id: "done",
    title: "Done",
    taskIds: ["task-4"],
    color: "bg-green-100",
  },
}

const initialTasks: Record<string, Task> = {
  "task-1": {
    id: "task-1",
    title: "Design user interface",
    description: "Create wireframes and mockups",
    priority: "High",
    assigneeId: "user-1",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "task-2": {
    id: "task-2",
    title: "Set up development environment",
    priority: "Medium",
    assigneeId: "user-2",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "task-3": {
    id: "task-3",
    title: "Implement authentication",
    priority: "High",
    assigneeId: "user-1",
    columnId: "in-progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "task-4": {
    id: "task-4",
    title: "Write documentation",
    priority: "Low",
    assigneeId: "user-3",
    columnId: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

const initialState: BoardState = {
  tasks: initialTasks,
  columns: initialColumns,
  columnOrder: ["todo", "in-progress", "done"],
  filters: {
    assignee: null,
    priority: null,
  },
  history: [],
  historyIndex: -1,
}

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
      const id = `task-${Date.now()}`
      const now = new Date().toISOString()
      const newTask: Task = {
        ...action.payload,
        id,
        createdAt: now,
        updatedAt: now,
      }

      state.tasks[id] = newTask
      state.columns[action.payload.columnId].taskIds.push(id)
    },

    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload
      if (state.tasks[id]) {
        state.tasks[id] = {
          ...state.tasks[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload
      const task = state.tasks[taskId]
      if (task) {
        // Remove from column
        const column = state.columns[task.columnId]
        column.taskIds = column.taskIds.filter((id) => id !== taskId)
        // Remove from tasks
        delete state.tasks[taskId]
      }
    },

    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string
        sourceColumnId: string
        destinationColumnId: string
        sourceIndex: number
        destinationIndex: number
      }>,
    ) => {
      const { taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload

      // Remove from source column
      state.columns[sourceColumnId].taskIds.splice(sourceIndex, 1)

      // Add to destination column
      state.columns[destinationColumnId].taskIds.splice(destinationIndex, 0, taskId)

      // Update task's column
      state.tasks[taskId].columnId = destinationColumnId
      state.tasks[taskId].updatedAt = new Date().toISOString()
    },

    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    clearFilters: (state) => {
      state.filters = { assignee: null, priority: null }
    },

    saveToHistory: (state) => {
      const currentState = {
        tasks: state.tasks,
        columns: state.columns,
        columnOrder: state.columnOrder,
        filters: state.filters,
        history: [],
        historyIndex: -1,
      }

      state.history = state.history.slice(0, state.historyIndex + 1)
      state.history.push(currentState)
      state.historyIndex = state.history.length - 1

      // Keep only last 50 states
      if (state.history.length > 50) {
        state.history = state.history.slice(-50)
        state.historyIndex = state.history.length - 1
      }
    },

    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--
        const previousState = state.history[state.historyIndex]
        state.tasks = previousState.tasks
        state.columns = previousState.columns
        state.columnOrder = previousState.columnOrder
        state.filters = previousState.filters
      }
    },

    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++
        const nextState = state.history[state.historyIndex]
        state.tasks = nextState.tasks
        state.columns = nextState.columns
        state.columnOrder = nextState.columnOrder
        state.filters = nextState.filters
      }
    },
  },
})

export const { addTask, updateTask, deleteTask, moveTask, setFilters, clearFilters, saveToHistory, undo, redo } =
  boardSlice.actions

export default boardSlice.reducer
