'use server'

import { revalidateTag } from 'next/cache'

export const shareFile = async (groupId: string, fileId: string) => {
  revalidateTag('get files')
  const response = await fetch(
    `https://notez-backend-97b9381de6f9.herokuapp.com/share/file/${fileId}/${groupId}`,
    {
      method: 'POST',
      cache: 'no-cache',
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`
    )
  }

  console.log(response.ok)

  const data = await response.json()

  return data
}
