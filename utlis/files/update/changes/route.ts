'use server'

import { revalidateTag } from 'next/cache'

export const saveContentChanges = async (
  fileId: string,
  content: string | undefined
) => {
  console.log(content)
  revalidateTag('get files')
  const response = await fetch(
    `https://notez-backend-97b9381de6f9.herokuapp.com/update/file/${fileId}`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
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
