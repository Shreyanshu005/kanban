export interface User {
  id: string
  name: string
  avatar: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: "High" | "Medium" | "Low"
  assigneeId: string
  columnId: string
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
  color: string
}

export interface FilterState {
  assignee: string | null
  priority: string | null
}

export interface BoardState {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  columnOrder: string[]
  filters: FilterState
  history: BoardState[]
  historyIndex: number
}
