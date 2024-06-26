'use server'

import { revalidateTag } from 'next/cache'

export const getParticularGroup = async (groupId: string) => {
  revalidateTag('group update')
  const response = await fetch(
    `https://notez-backend-97b9381de6f9.herokuapp.com/get/group/${groupId}`,
    {
      cache: 'no-cache',
      next: { tags: ['particular group update'] },
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  return data
}
