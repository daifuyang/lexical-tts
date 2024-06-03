import Category from "@/components/category";
import VoiceCard from "@/components/voiceCard";
import { useAppSelector } from "@/redux/hook";
import { Col, Modal, Row } from "antd";
import type { ModalProps } from "antd";

export default function VoiceModal(props: ModalProps) {
  const voices = useAppSelector( (state) => state.voiceState.list )
  return (
    <Modal width={"60%"} {...props}>
      <div>
        <Category />
        <Category />
        <Category />
        <div>
          <Row gutter={[16, 16]}>
            {voices.map((item) => {
              return (
                <Col span={6}>
                  <VoiceCard data={item} />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </Modal>
  );
}
