import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = any // Just simplifying for now since it's an audit

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = {
  type: string
  toast?: ToasterToast
  toastId?: string
}

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const toast = React.useCallback(
    ({ ...props }: any) => {
      const id = genId()

      const update = (props: ToasterToast) =>
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...props } : t))
        )
      const dismiss = () => setToasts((prev) => prev.filter((t) => t.id !== id))

      setToasts((prev) => [...prev, { id, dismiss, update, ...props }])

      return {
        id: id,
        dismiss,
        update,
      }
    },
    []
  )

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => setToasts((prev) => prev.filter((t) => t.id !== toastId)),
  }
}
