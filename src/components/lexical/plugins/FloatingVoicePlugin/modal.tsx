import Category from "@/components/category";
import VoiceCard from "@/components/voiceCard";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { voiceList } from "@/services/voice";
import { Col, Modal, Row } from "antd";
import type { ModalProps } from "antd";
import { useEffect, useState } from "react";
import { fetchVocieCategory } from "@/redux/slice/voiceState";
import { ADD_VOICE_COMMAND } from "../VoicePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function VoiceModal(props: ModalProps) {

  const [editor] = useLexicalComposerContext();

  const voiceCategory = useAppSelector((state) => state.voiceState.category);
  const [voices, setVoices] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (voiceCategory.length === 0) {
      dispatch(fetchVocieCategory({ pageSize: 0 }));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchVoice = async () => {
      const res: any = await voiceList();
      if (res.code === 1) {
        setVoices(res.data.data);
      }
    };
    fetchVoice();
  }, []);

  return (
    <Modal width={"60%"} {...props}>
      <div>
        <Category title="分类" data={voiceCategory} />
        {/* <Category />
        <Category /> */}
        <div>
          <Row gutter={[16, 16]}>
            {voices.map((item: any) => {
              return (
                <Col span={6}>
                  <VoiceCard
                    onClick={() => {
                      console.log('item',item)
                      editor.dispatchCommand(ADD_VOICE_COMMAND, {
                        data: item.name
                      });
                    }}
                    data={item}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </Modal>
  );
}
