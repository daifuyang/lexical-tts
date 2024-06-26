import { useAppSelector } from "@/redux/hook";
import PinyinRadio from "./pinyinRadio";

export default function Options() {
    const initialState = useAppSelector((state) => state.initialState);
    const { floatEditType } = initialState;
    function getContent() {
        if (floatEditType === "pinyin") {
            return <PinyinRadio />;
          } 
          return null;
    }

    return getContent();

}