import { useState, useEffect } from "react";
import { Input, Modal, Select, Tabs, Avatar, Tag, Button, Slider, Skeleton } from "antd";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { getVoiceList } from "@/services/voice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchDefaultVoice } from "@/redux/slice/voiceState";
import classNames from "classnames";

interface VoiceModalProps {
  open: boolean;
  onOpenChange: (togger: boolean) => void;
  items: any[]; // Replace 'any' with the actual type of items if known
  onChange: (activeKey: string) => void; // Replace 'any' with the actual event type if known
}

function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str; // 如果字符串长度小于等于指定长度，则直接返回原字符串
  } else {
    return str.substring(0, maxLength); // 否则，返回前两个字符
  }
}

export default function VoiceModal(props: VoiceModalProps) {
  const { open, onOpenChange, items, onChange } = props;

  const [voiceList, setVoiceList] = useState([]); // 所有主播列表

  const [currentVoice, setCurrentVoice] = useState<any>(null); // 当前右侧的显示主播

  const [activeVoive, setActiveVoice] = useState<any>(null);

  const [voiceLoading, setVoiceLoading] = useState(false);

  const defaultVoice = useAppSelector((state) => state.voiceState.defaultVoice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setVoiceLoading(true);
        const res: any = await getVoiceList({
          pageSize: 24
        });
        setVoiceLoading(false);
        if (res.code === 1) {
          setVoiceList(res.data.data);
        }
      };
      dispatch(fetchDefaultVoice());
      fetchData();
    }
  }, [open]);

  useEffect(() => {

    const fetchActiveVoice = async () => {

      // todo 获取主播详细信息

      setCurrentVoice(activeVoive || defaultVoice);
    }
    fetchActiveVoice()
  }, [defaultVoice, activeVoive]);

  return (
    <Modal
      className="voice-modal"
      title={
        <Tabs tabBarStyle={{ margin: 0 }} defaultActiveKey="1" items={items} onChange={onChange} />
      }
      width="1000px"
      centered
      open={open}
      footer={false}
      maskClosable={false}
      onCancel={() => {
        onOpenChange?.(false);
      }}
    >
      <div className="voice-container">
        <div className="voice-list">
          <div className="voice-header">
            <div className="voice-search">
              <Input placeholder="请输入主播名称" prefix={<SearchOutlined />} />
            </div>
            <div className="voice-filter">
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "性别" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "年龄" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "领域" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "风格" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "语种" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
            </div>
          </div>
          <div className="voice-content scrollbar">
            <div className="voice-body">
              <div className="voice-cards">
                {voiceLoading && <Skeleton />}

                {voiceList.map((item: any) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveVoice(item);
                      }}
                      className="voice-card-item"
                    >
                      <div
                        className={classNames({
                          ["voice-card"]: true,
                          ["voice-card-active"]: item?.id === activeVoive?.id
                        })}
                      >
                        <div className="voice-card-avatar">
                          <Avatar
                            style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
                            size="large"
                            gap={4}
                          >
                            {truncateString(item.name, 2)}
                          </Avatar>
                        </div>
                        <div className="vocie-card-content">
                          <div className="voice-card-title">{item.name}</div>
                          <div className="voice-card-tags">
                            <Tag bordered={false} color="processing">
                              小说、教育
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="voice-detail">
          <div className="voice-detail-voice">
            <div className="voice-detail-voice-avatar">
              <Avatar
                style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
                size="large"
                gap={4}
              >
                {currentVoice?.name}
              </Avatar>
            </div>
            <div className="voice-detail-voice-content">
              <div className="voice-detail-voice-content-title-wrap">
                <span className="voice-detail-voice-content-title">{currentVoice?.name}</span>
                <span className="voice-detail-voice-content-collect">
                  <StarOutlined style={{ fontSize: 14, marginRight: 2 }} />
                  <span>收藏</span>
                </span>
              </div>
              <div className="voice-detail-voice-content-desc">亲切温和</div>
            </div>
          </div>
          <div className="voice-detail-style">
            {new Array(10).fill(0).map((item) => {
              return (
                <div className="voice-detail-style-item">
                  <div className="voice-detail-style-item-wrap">
                    <div className="voice-detail-style-item-avatar">
                      <Avatar
                        style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
                        size="small"
                        gap={4}
                      >
                        默
                      </Avatar>
                    </div>
                    <div className="voice-detail-style-item-title">默认</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="voice-detail-slider">
            <div className="voice-detail-slider-group">
              <h2 className="voice-detail-slider-title">语速</h2>
              <div className="voice-detail-slider-container">
                <div className="voice-detail-slider-wrap">
                  <span className="voice-detail-slider-start-label">慢</span>
                  <Slider style={{ width: "100%" }} defaultValue={30} />
                  <span className="voice-detail-slider-end-label">快</span>
                </div>
                <div className="voice-detail-slider-btn">
                  <Button size="small">默认</Button>
                </div>
              </div>
            </div>
            <div className="voice-detail-slider-group">
              <h2 className="voice-detail-slider-title">音量</h2>
              <div className="voice-detail-slider-container">
                <div className="voice-detail-slider-wrap">
                  <span className="voice-detail-slider-start-label">慢</span>
                  <Slider style={{ width: "100%" }} defaultValue={30} />
                  <span className="voice-detail-slider-end-label">快</span>
                </div>
                <div className="voice-detail-slider-btn">
                  <Button size="small">默认</Button>
                </div>
              </div>
            </div>
            <div className="voice-detail-slider-group">
              <h2 className="voice-detail-slider-title">语调</h2>
              <div className="voice-detail-slider-container">
                <div className="voice-detail-slider-wrap">
                  <span className="voice-detail-slider-start-label">慢</span>
                  <Slider style={{ width: "100%" }} defaultValue={30} />
                  <span className="voice-detail-slider-end-label">快</span>
                </div>
                <div className="voice-detail-slider-btn">
                  <Button size="small">默认</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
