import { useAppSelector } from "@/redux/hook";
import PinyinRadio from "./pinyinRadio";
import SymbolOption from "./symbolOption";

export default function Options() {
    const initialState = useAppSelector((state) => state.initialState);
    const { floatEditType } = initialState;
    function getContent() {
        if (floatEditType === "pinyin") {
            return <PinyinRadio />;
        }else if(floatEditType === "symbol") {
            return <SymbolOption />;
        }
        return null;
    }

    return getContent();

}