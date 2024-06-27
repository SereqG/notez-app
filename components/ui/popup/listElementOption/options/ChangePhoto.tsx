import { TextInput } from '@/components/ui/inputs/TextInput'
import { Dispatch, SetStateAction, useState } from 'react'

import { groupType } from '@/types/data'
import { updateName } from '@/utlis/groups/groupNameUpdate/route'
import { SquareButton } from '@/components/ui/buttons/SquareButton'
import { FaCheck } from 'react-icons/fa6'
import { useBottomPopupDataContext } from '@/context/BottomPopupContext'
import { MainButton } from '@/components/ui/buttons/MainButton'
import { uploadFile } from '@/utlis/groups/photo/uploadFile'

interface props {
  groupId: string
}

export function ChangePhoto({ groupId }: props) {
  const { bottomPopupData, setBottomPopupData } = useBottomPopupDataContext()

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const form = event.currentTarget.closest('form')
    if (form) {
      const formData = new FormData(form)
      await uploadFile(groupId, formData).then((res) => {
        setBottomPopupData({ isVisible: true, isSuccess: true })
      })
    }
  }

  return (
    <div className="flex">
      <form className="flex flex-col">
        <label htmlFor="img">Upload image</label>
        <input type="file" name="img" id="img" />
        <div className="mt-4 w-36">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  )
}
