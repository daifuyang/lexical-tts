"use client";
import { useDispatch } from "react-redux";
import { openMembershipModal } from "@/redux/slice/modalState";
import { CrownOutlined } from "@ant-design/icons";

export default function MembershipButton() {
  const dispatch = useDispatch();

  const handleClick = () => {
    console.log("点击了会员中心按钮");
    dispatch(openMembershipModal());
  };

  return (
    <div onClick={handleClick} className="text-amber-400 mr-4 cursor-pointer">
      <CrownOutlined className="text-xl" /> 会员中心
    </div>
  );
}
