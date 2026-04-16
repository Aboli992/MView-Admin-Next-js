'use client'

interface Props {
  message: string
  visible: boolean
}

export default function Flash({ message, visible }: Props) {
  return (
    <div className={`flash${visible ? ' show' : ''}`}>{message}</div>
  )
}
