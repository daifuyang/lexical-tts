import { useState, useEffect } from "react";
import { Input, Modal, Select, Tabs, Avatar, Tag, Button, Slider, Skeleton } from "antd";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { getVoiceCategoryList, getVoiceList } from "@/services/voice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import classNames from "classnames";
import { getDictData } from "@/services/dictData";
import { getVoiceStyleList } from "@/services/voice";
import { fetchActiveVoice } from "@/redux/slice/voiceState";

interface VoiceModalProps {
  open: boolean;
  onOpenChange: (togger: boolean) => void;
  items: any[]; // Replace 'any' with the actual type of items if known
  onChange: (activeKey: string) => void; // Replace 'any' with the actual event type if known
  onOk:(values: any) => void; 
}

function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str; // 如果字符串长度小于等于指定长度，则直接返回原字符串
  } else {
    return str.substring(0, maxLength); // 否则，返回前两个字符
  }
}

export default function VoiceModal(props: VoiceModalProps) {
  const { open, onOpenChange, items, onChange, onOk } = props;

  const [voiceList, setVoiceList] = useState([]); // 所有主播列表

  const [voiceListLoading, setVoiceListLoading] = useState(false);

  const [voiceActiveId, setVoiceActiveId] = useState(0); // 当前选中主播id

  const [voiceActiveStyle, setVoiceActiveStyle] = useState(''); // 当前选中风格id

  const [rate, setRate] = useState(0); // 语速

  const [volume, setVolume] = useState(0) // 音量

  const [pitch, setPitch] = useState(0) // 语调

  const voiceState = useAppSelector((state) => state.voiceState);

  const { activeVoice, loading } = voiceState;

  const activeVoiceLoading = loading.activeVoice;

  const [genderOptions, setGenderOptions] = useState<any>([]);

  const [ageOptions, setAgeOptions] = useState<any>([]);

  const [languageOptions, setLanguageOptions] = useState<any>([]);

  const [categoryOptions, setCategoryOptions] = useState<any>([]);

  const [styleOptions, setStyleOptions] = useState<any>([]);

  const dispatch = useAppDispatch();

  const increment = (value: number) => {
    if(value < 10) {
      return value + 1;
    }
    return value
  }

  const decrement  = (value: number) => {
    if(value > -10) {
      return value - 1;
    }
    return value
  }

  useEffect(() => {
      const fetchData = async () => {
        setVoiceListLoading(true);
        const res: any = await getVoiceList({
          pageSize: 24
        });
        setVoiceListLoading(false);
        if (res.code === 1) {
          setVoiceList(res.data.data);
        }
      };
      fetchData();

      const fetchDictData = async (type: string) => {
        const res: any = await getDictData(type);
        if (res.code === 1) {
          const data = res.data;
          if (type === "tts_voice_gender") {
            setGenderOptions(data);
          } else if (type === "tts_voice_age") {
            setAgeOptions(data);
          } else if (type === "tts_voice_language") {
            setLanguageOptions(data);
          }
        }
      };

      fetchDictData("tts_voice_gender");
      fetchDictData("tts_voice_age");
      fetchDictData("tts_voice_language");

      const fetchVoiceStyles = async () => {
        const res: any = await getVoiceStyleList();
        if (res.code === 1) {
          const options = res.data?.map((item: any) => ({
            label: item.name,
            value: item.style
          }));
          setStyleOptions(options);
        }
      };

      fetchVoiceStyles();

      const fetchVoiceCatrgory = async () => {
        const res: any = await getVoiceCategoryList({ pageSize: 0 });
        if (res.code === 1) {
          const options = res.data?.map((item: any) => ({
            label: item.name,
            value: item.id
          }));
          setCategoryOptions(options);
        }
      };

      fetchVoiceCatrgory();
  }, []);

  useEffect( () => {
    if(activeVoice?.id && !voiceActiveId) {
      setVoiceActiveId(activeVoice.id)
    }
    if(activeVoiceLoading === "failed") {
      setVoiceActiveId(0)
    }
  } ,[activeVoice, activeVoiceLoading])

  return (
    <Modal
      className="voice-modal"
      title={
        <Tabs tabBarStyle={{ margin: '0 0 0 24px' }} defaultActiveKey="1" items={items} onChange={onChange} />
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
                options={[{ value: "", label: "性别" }, ...genderOptions]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[{ value: "", label: "年龄" }, ...ageOptions]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[{ value: "", label: "领域" }, ...categoryOptions]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[{ value: "", label: "风格" }, ...styleOptions]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[{ value: "", label: "语种" }, ...languageOptions]}
              />
            </div>
          </div>
          <div className="voice-content">
            <div className="voice-body scrollbar">
              <div className="voice-cards">
                {voiceListLoading ? (
                  <Skeleton />
                ) : (
                  voiceList.map((item: any) => {
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setVoiceActiveId(item.id);
                          dispatch(fetchActiveVoice(item.id));
                        }}
                        className="voice-card-item"
                      >
                        <div
                          className={classNames({
                            ["voice-card"]: true,
                            ["voice-card-active"]: item?.id === voiceActiveId
                          })}
                        >
                          <div className="voice-card-avatar">
                            <Avatar
                              style={{ backgroundColor: "#87d068", verticalAlign: "middle" }}
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
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="voice-detail scrollbar">
          {activeVoiceLoading === "loading" ? (
             <div className="voice-detail-voice">
            <Skeleton />
            </div>
          ) : (
            <>
              <div className="voice-detail-voice">
                <div className="voice-detail-voice-avatar">
                  <Avatar
                    style={{ backgroundColor: "#87d068", verticalAlign: "middle" }}
                    size="large"
                    gap={4}
                  >
                    {activeVoice?.name}
                  </Avatar>
                </div>
                <div className="voice-detail-voice-content">
                  <div className="voice-detail-voice-content-title-wrap">
                    <span className="voice-detail-voice-content-title">{activeVoice?.name}</span>
                    <span className="voice-detail-voice-content-collect">
                      <StarOutlined style={{ fontSize: 14, marginRight: 2 }} />
                      <span>收藏</span>
                    </span>
                  </div>
                  <div className="voice-detail-voice-content-desc">亲切温和</div>
                </div>
                <div className="voice-detail-voice-extra">
                  <Button onClick={ () => {
                      onOk?.({...activeVoice, style: voiceActiveStyle, rate, volume, pitch })
                  } } type="primary">使用</Button>
                </div>
              </div>
              <div className="voice-detail-style">
                {activeVoice?.voiceStyle?.map((item: any) => {
                  return (
                    <div onClick={ () => {
                      setVoiceActiveStyle(item?.style)
                    } } key={item?.style} className="voice-detail-style-item">
                      <div className={
                        classNames({
                          'voice-detail-style-item-wrap': true,
                          'voice-detail-style-item-active': item?.style === voiceActiveStyle
                        })
                      }>
                        <div className="voice-detail-style-item-avatar">
                          <Avatar
                            style={{ backgroundColor: "#87d068", verticalAlign: "middle" }}
                            size="small"
                            gap={4}
                          >
                            {truncateString(item?.name, 2)}
                          </Avatar>
                        </div>
                        <div className="voice-detail-style-item-title">{item?.name}</div>
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
                      <span onClick={ () => {
                        const value = decrement(rate)
                        setRate(value)
                      } } className="voice-detail-slider-start-label">慢</span>
                      <Slider min={-10} max={10} step={1} style={{ width: "100%" }} onChange={ (value) => {
                        setRate(value);
                      } } value={rate} />
                      <span onClick={ () => {
                        const value = increment(rate)
                        setRate(value)
                      } } className="voice-detail-slider-end-label">快</span>
                    </div>
                    <div className="voice-detail-slider-btn">
                      <Button onClick={ () => {
                        setRate(0)
                      } } size="small">默认</Button>
                    </div>
                  </div>
                </div>
                <div className="voice-detail-slider-group">
                  <h2 className="voice-detail-slider-title">音量</h2>
                  <div className="voice-detail-slider-container">
                    <div className="voice-detail-slider-wrap">
                      <span
                      onClick={ () => {
                        const value = decrement(volume)
                        setVolume(value)
                      } }
                      className="voice-detail-slider-start-label">慢</span>
                      <Slider min={-10} max={10} step={1} style={{ width: "100%" }} onChange={ (value) => {
                        setVolume(value);
                      } } value={volume} />
                      <span onClick={ () => {
                        const value = increment(volume)
                        setVolume(value)
                      } } className="voice-detail-slider-end-label">快</span>
                    </div>
                    <div onClick={ () => {
                        setVolume(0)
                      } } className="voice-detail-slider-btn">
                      <Button size="small">默认</Button>
                    </div>
                  </div>
                </div>
                <div className="voice-detail-slider-group">
                  <h2 className="voice-detail-slider-title">语调</h2>
                  <div className="voice-detail-slider-container">
                    <div className="voice-detail-slider-wrap">
                      <span
                      onClick={ () => {
                        const value = decrement(pitch)
                        setPitch(value)
                      } }
                      className="voice-detail-slider-start-label">慢</span>
                      <Slider min={-10} max={10} step={1} style={{ width: "100%" }} onChange={ (value) => {
                        setPitch(value);
                      } } value={pitch} />
                      <span  onClick={ () => {
                        const value = increment(pitch)
                        setPitch(value)
                      } } className="voice-detail-slider-end-label">快</span>
                    </div>
                    <div className="voice-detail-slider-btn">
                      <Button onClick={ () => {
                        setPitch(0)
                      } } size="small">默认</Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
