import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'

import { MembersList } from './options/MembersList'
import { FaArrowLeft } from 'react-icons/fa'
import { ChangeGroupName } from './options/ChangeGroupName'
import { ModifyUserList } from './options/ModifyUserList'
import { getParticularGroup } from '@/utlis/groups/get/getParticularGroup/route'
import { groupType } from '@/types/data'
import { deleteGroup } from '@/utlis/groups/delete/route'
import { usePopupDataContext } from '@/context/PopupData'

interface props {
  groupId: string
}

export function ListElementOption({ groupId }: props) {
  const { user } = useUser()

  const { popupData, setPopupData } = usePopupDataContext()

  const [groupData, setGroupData] = useState<groupType>()
  const [chosenOption, setChoseOption] = useState<
    | ''
    | 'showMembers'
    | 'changeName'
    | 'modifyMembersList'
    | 'modifyAdminsList'
    | 'delete'
  >('')

  const options = [
    {
      label: 'Show all members',
      onClick: () => setChoseOption('showMembers'),
      isAuthorizationRequired: false,
    },
    {
      label: 'Change name',
      onClick: () => setChoseOption('changeName'),
      isAuthorizationRequired: true,
    },
    {
      label: 'Modify members list',
      onClick: () => setChoseOption('modifyMembersList'),
      isAuthorizationRequired: true,
    },
    {
      label: 'Modify admins list',
      onClick: () => setChoseOption('modifyAdminsList'),
      isAuthorizationRequired: true,
    },
    {
      label: 'Delete',
      onClick: () => {
        deleteGroup(groupData?.id)
        setPopupData({ ...popupData, isVisible: !popupData.isVisible })
      },
      isAuthorizationRequired: true,
    },
  ]

  useEffect(() => {
    getParticularGroup(groupId).then((group) => setGroupData(group.groups[0]))
  }, [groupId])

  if (groupData != undefined) {
    return (
      <div className="flex">
        {chosenOption != '' && (
          <button
            onClick={() => setChoseOption('')}
            className="absolute right-6 top-6 z-20 rounded-full bg-background p-3 text-base transition-all duration-300 hover:bg-primary"
          >
            <FaArrowLeft />
          </button>
        )}

        <div className="flex w-full flex-col gap-3">
          <h1>
            {groupData.name.length > 25
              ? groupData.name.slice(0, 24) + '...'
              : groupData.name}
          </h1>
          {chosenOption == '' ? (
            <div className="mb-3 mt-4 flex flex-col items-start gap-3">
              {options.map(
                (el: {
                  label: string
                  onClick: () => void
                  isAuthorizationRequired: boolean
                }) => (
                  <button
                    className={`text-xs underline ${
                      el.isAuthorizationRequired &&
                      user != null &&
                      !groupData.admins.includes(
                        user.emailAddresses[0].emailAddress
                      )
                        ? 'text-gray-400'
                        : ''
                    }`}
                    disabled={
                      el.isAuthorizationRequired &&
                      user != null &&
                      !groupData.admins.includes(
                        user.emailAddresses[0].emailAddress
                      )
                    }
                    onClick={el.onClick}
                    key={el.label}
                  >
                    {el.label}
                  </button>
                )
              )}
            </div>
          ) : chosenOption == 'showMembers' ? (
            <MembersList userIds={groupData.members} />
          ) : chosenOption == 'changeName' ? (
            <ChangeGroupName data={groupData} setData={setGroupData} />
          ) : chosenOption == 'modifyMembersList' ? (
            <ModifyUserList
              data={groupData}
              userType="members"
              setData={setGroupData}
            />
          ) : (
            chosenOption == 'modifyAdminsList' && (
              <ModifyUserList
                data={groupData}
                userType="admins"
                setData={setGroupData}
              />
            )
          )}
        </div>
      </div>
    )
  }
}
