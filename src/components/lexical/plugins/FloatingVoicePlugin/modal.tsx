import Category from "@/components/category";
import VoiceCard from "@/components/voiceCard";
import { Col, Modal, Row } from "antd";
import type { ModalProps } from "antd";

export default function VoiceModal(props: ModalProps) {
  return (
    <Modal width={"60%"} {...props}>
      <div>
        <Category />
        <Category />
        <Category />
        <div>
          <Row gutter={[16, 16]}>
            {new Array(24).fill(0).map((item, index) => {
              return (
                <Col span={8}>
                  <VoiceCard />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </Modal>
  );
}
