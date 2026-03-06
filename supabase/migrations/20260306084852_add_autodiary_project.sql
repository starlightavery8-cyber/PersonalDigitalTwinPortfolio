/*
  # Add AutoDiary Project

  ## Summary
  Inserts the AutoDiary project into the projects table.

  ## New Data
  - 1 new project: AutoDiary — Full-Auto Audio/Video Lifelog System
    - Category: Hardware
    - Featured: true
    - sort_order: positioned after existing Hardware projects
    - Full bilingual content (EN + ZH)
    - 4 impact stats, 8 tech tags

  ## Notes
  - Shifts sort_order of existing projects >= 5 up by 1 to make room at position 5
*/

UPDATE projects SET sort_order = sort_order + 1 WHERE sort_order >= 5;

INSERT INTO projects (
  title,
  category,
  description,
  long_description,
  logic_map,
  media_urls,
  impact_stats,
  tech_tags,
  is_featured,
  sort_order,
  translations
)
VALUES (
  'AutoDiary — Full-Auto Audio/Video Lifelog',
  'Hardware',
  'An ESP32S3-based fully automatic life-logging device. Captures a photo every 30 seconds, streams audio in real time via WebSocket, and uses Whisper AI to transcribe speech — building a searchable digital memory without any manual effort.',
  E'## Background\nHave you ever wondered what it would be like if a device could automatically record your day?\n\nNot manual photos, not deliberate recordings — but effortless, automatic, around-the-clock documentation.\n\nThat''s the idea behind AutoDiary. I wanted to build something that could capture life moments every 30 seconds, convert ambient audio to text in real time, and automatically organize everything into a timeline you can revisit anytime.\n\nThis isn''t just a technical project — it''s an exploration of what "digital memory" could look like.\n\n## System Architecture\n**Hardware Layer (XIAO ESP32S3 Sense)** — OV2640 camera at VGA resolution, PDM digital microphone at 16 kHz, 8 MB PSRAM for frame buffering, 802.11 b/g/n WiFi, and a dual-core processor: Core 0 handles networking while Core 1 handles audio/video capture.\n\n**Firmware (C++/Arduino/FreeRTOS)** — Dual-core parallel scheduling with FreeRTOS tasks. DMA-based I2S audio transfer, JPEG compression for image transmission, and a watchdog mechanism to prevent task hangs.\n\n**Server (Python/asyncio)** — Asynchronous WebSocket server with separate `/video` and `/audio` endpoints. Images are saved to date-organized folders. Audio is buffered and sent to Whisper API for transcription, then aligned with timestamps.\n\n**AI Layer (OpenAI Whisper)** — Asynchronous API calls that don''t block the main pipeline. VAD (Voice Activity Detection) splits audio into clean segments. Transcripts are time-aligned with images and stored as JSON.\n\n## Key Challenges Solved\n**Audio/video sync** — NTP time synchronization ensures device and server clocks match. Audio is segmented in 30-second intervals to align with image captures. Metadata links each image file to its corresponding audio segment, achieving < 100 ms sync error.\n\n**Power optimization** — Dynamic CPU frequency scaling (240 MHz under load, 80 MHz idle). WiFi modem-sleep mode between transmissions. Camera sensor powered down between captures. Result: 8+ hours on a 5000 mAh battery with 60% standby power reduction.\n\n**Network resilience** — PSRAM caches the last 10 frames locally. Missed-data markers enable resume-on-reconnect. Auto-reconnect triggers within 5 seconds of dropout. Under weak WiFi, data loss rate < 1%.\n\n**Audio quality** — PDM digital microphone with high SNR. Digital noise suppression (NS) and automatic gain control (AGC) in software. Whisper''s built-in denoising handles residual noise. Result: 95%+ accuracy in quiet environments, 85%+ in office conditions.',
  NULL,
  ARRAY[]::text[],
  '[{"label":"Auto Capture","value":"30s"},{"label":"Battery Life","value":"8h+"},{"label":"Stream Latency","value":"<200ms"},{"label":"Speech Accuracy","value":"95%+"}]'::jsonb,
  ARRAY['ESP32S3','C++','FreeRTOS','Python','asyncio','WebSocket','OpenAI Whisper','Arduino'],
  true,
  5,
  jsonb_build_object(
    'zh', jsonb_build_object(
      'title', 'AutoDiary — 全自动音视频 Lifelog 系统',
      'description', '基于 ESP32S3 的全自动生活记录设备。每 30 秒自动拍摄，通过 WebSocket 实时传输音频，并使用 Whisper AI 进行语音识别——无需任何手动操作，构建可检索的数字记忆。',
      'long_description', E'## 项目背景\n如果有一台设备能自动记录你的一天，会是什么样的？\n\n不是手动拍照，不是刻意录像，而是无感知的、自动的、全天候的记录。\n\n这就是 AutoDiary 的初衷。我想构建一个能每 30 秒自动捕捉生活瞬间、实时将环境声音转为文字、自动整理成时间线随时回顾的小型设备。\n\n这不仅是一个技术项目，更是对"数字记忆"可能性的探索。\n\n## 系统架构\n**硬件层 (XIAO ESP32S3 Sense)** — OV2640 摄像头 VGA 分辨率，PDM 数字麦克风 16 kHz 采样，8MB PSRAM 图像缓冲，802.11 b/g/n WiFi，双核处理器：Core 0 处理网络，Core 1 处理音视频采集。\n\n**固件 (C++/Arduino/FreeRTOS)** — FreeRTOS 双核并行任务调度。DMA I2S 音频传输，JPEG 压缩减少传输带宽，看门狗机制防止任务卡死。\n\n**服务端 (Python/asyncio)** — 异步 WebSocket 服务器，独立 `/video` 和 `/audio` 端点。图像按日期文件夹存档。音频缓存后调用 Whisper API 转录，结果按时间戳对齐存储。\n\n**AI 层 (OpenAI Whisper)** — 异步 API 调用不阻塞主流程。VAD 语音活动检测自动分割语音段。转录文本与图像时间对齐，以 JSON 格式存储。\n\n## 核心技术难点\n**音视频同步** — NTP 时间同步确保设备与服务器时钟一致。音频按 30 秒间隔分段，与图像拍摄时刻对齐。元数据关联每张图像与对应音频段，同步误差 < 100ms。\n\n**功耗优化** — CPU 频率动态调节（满载 240MHz，空闲 80MHz）。WiFi 调制解调器休眠模式减少间歇功耗。非拍摄时段关闭摄像头传感器。成果：5000mAh 电池续航 8+ 小时，待机功耗降低 60%。\n\n**网络稳定性** — PSRAM 本地缓存最近 10 帧。断点续传机制记录已发送位置，重连后自动补传。断线 5 秒内自动重连。弱网环境数据丢失率 < 1%。\n\n**音频质量** — 高信噪比 PDM 数字麦克风。软件数字降噪 (NS) + 自动增益控制 (AGC)。Whisper 内置降噪处理残余噪声。成果：安静环境识别准确率 95%+，办公环境 85%+。',
      'impact_stats', '[{"label":"自动拍摄间隔","value":"30秒"},{"label":"电池续航","value":"8小时+"},{"label":"传输延迟","value":"<200ms"},{"label":"语音准确率","value":"95%+"}]'::jsonb
    )
  )
);
