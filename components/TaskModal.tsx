"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "../types"
import { users } from "../data/users"
import { addTask, updateTask, saveToHistory } from "../store/boardSlice"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  defaultColumnId?: string
}

export default function TaskModal({ isOpen, onClose, task, defaultColumnId }: TaskModalProps) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    assigneeId: "",
    columnId: defaultColumnId || "todo",
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        assigneeId: task.assigneeId,
        columnId: task.columnId,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        assigneeId: users[0]?.id || "",
        columnId: defaultColumnId || "todo",
      })
    }
  }, [task, defaultColumnId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    dispatch(saveToHistory())

    if (task) {
      dispatch(
        updateTask({
          id: task.id,
          updates: formData,
        }),
      )
    } else {
      dispatch(addTask(formData))
    }

    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={formData.assigneeId} onValueChange={(value) => handleChange("assigneeId", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
