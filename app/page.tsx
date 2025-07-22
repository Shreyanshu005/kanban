"use client"

import { Provider } from "react-redux"
import { store } from "../store"
import KanbanBoard from "../components/KanbanBoard"

export default function Home() {
  return (
    <Provider store={store}>
      <KanbanBoard />
    </Provider>
  )
}
