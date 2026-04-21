'use client'

import type { PageName, Role } from '@/lib/types'
import SubmitUpdateImpl from '@/components/reports/SubmitUpdate'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function SubmitUpdate({ flash }: Props) {

  return <SubmitUpdateImpl flash={flash} />
}
