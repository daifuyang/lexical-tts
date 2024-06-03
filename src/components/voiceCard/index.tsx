import { Avatar } from "antd";

export default function VoiceCard (props: any) {

    const { data } = props

    return (
        <div className="relative group overflow-hidden  border border-gray-200 rounded-lg shadow hover:bg-gray-100">
        <div className="flex items-center gap-2 p-4">
          <Avatar>U</Avatar>
          <div className="flex-1 grid gap-1">
            <h3 className="text-base overflow-hidden whitespace-nowrap overflow-ellipsis">
              {data.name}
            </h3>
            {/* <p className="overflow-hidden whitespace-nowrap overflow-ellipsis text-sm text-gray-500 dark:text-gray-400">
              {item.desc}
            </p> */}
          </div>
        </div>
      </div>
    )
}