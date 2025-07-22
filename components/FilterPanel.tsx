"use client"

import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X, Undo, Redo } from "lucide-react"
import type { RootState } from "../store"
import { setFilters, clearFilters, undo, redo } from "../store/boardSlice"
import { users } from "../data/users"

export default function FilterPanel() {
  const dispatch = useDispatch()
  const { filters, history, historyIndex } = useSelector((state: RootState) => state.board)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const handleAssigneeChange = (value: string) => {
    dispatch(setFilters({ assignee: value === "all" ? null : value }))
  }

  const handlePriorityChange = (value: string) => {
    dispatch(setFilters({ priority: value === "all" ? null : value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Actions
          {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} active</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Assignee</label>
            <Select value={filters.assignee || "all"} onValueChange={handleAssigneeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <Select value={filters.priority || "all"} onValueChange={handlePriorityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleClearFilters} disabled={activeFiltersCount === 0}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>

          <div className="flex items-center gap-1 ml-auto">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo} title="Undo">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo} title="Redo">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
