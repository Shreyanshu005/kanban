"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

export const useLocalStorage = () => {
  const boardState = useSelector((state: RootState) => state.board)

  useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        localStorage.setItem(
          "kanban-board",
          JSON.stringify({
            tasks: boardState.tasks,
            columns: boardState.columns,
            columnOrder: boardState.columnOrder,
          }),
        )
      } catch (error) {
        console.error("Failed to save to localStorage:", error)
      }
    }

    const timeoutId = setTimeout(saveToLocalStorage, 1000)
    return () => clearTimeout(timeoutId)
  }, [boardState.tasks, boardState.columns, boardState.columnOrder])
}
