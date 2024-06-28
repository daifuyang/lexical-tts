import { useAppSelector } from "@/redux/hook";
import PinyinRadio from "./pinyinRadio";
import SymbolOption from "./symbolOption";
import { SpeedSlider } from "./speedSlider";

export default function Options() {
    const initialState = useAppSelector((state) => state.initialState);
    const { floatEditType } = initialState;
    function getContent() {
        if (floatEditType === "pinyin") {
            return <PinyinRadio />;
        }else if(floatEditType === "symbol") {
            return <SymbolOption />;
        }else if(floatEditType === "speed") {
            return <SpeedSlider />;
        }
        return null;
    }

    return getContent();

}