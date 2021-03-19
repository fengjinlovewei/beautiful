import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'underscore';
import WBAPP, { Video } from '@w/wbapp';
import eventEmitter from '@p/shared/utils/eventEmitter';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  UIManager,
  findNodeHandle,
  AsyncStorage,
} from 'react-native';
import faceRecognizeAndOptimize from '@p/shared/utils/faceRecognizeAndOptimize';
import resolveImageURL from '@p/shared/utils/resolveImageURL';
import styles from './ImagePanel/style';

function calcDuration(duration) {
  const s = duration - 0;
  let diffs = s % 60;
  let m = (s - diffs) / 60;
  diffs = diffs > 9 ? diffs : `0${diffs}`;
  m = m > 9 ? m : `0${m}`;
  return `${m}:${diffs}`;
}
const getTimeFn = (context) => {
  let lastCurrentTime = 0,
    time = 0;
  timer = null;
  return ({ currentTime, duration }) => {
    console.log(currentTime, duration, lastCurrentTime);
    if (currentTime !== lastCurrentTime) {
      // 说明正在播
      // 这个判断是因为video的回调方法数据有时候会出错
      if (currentTime > lastCurrentTime) {
        time += currentTime - lastCurrentTime;
        lastCurrentTime = currentTime;
      }
    } else {
      // 说明暂停了
      WBAPP.toast({ message: `${time}` });
      console.log(time);
      time = 0;
    }
    clearTimeout(timer);
    // 可能是组件销毁了，叶铿是播完了，需要判断
    timer = setTimeout(() => {
      // 说明播完了
      if (allVideo[context.source].currentTime === 0) {
        lastCurrentTime = 0;
      }
      // 说明销毁了
      console.log();
      WBAPP.toast({ message: `${time}` });
      console.log(time);
      time = 0;
    }, 1000);
  };
};
export const height = () => {
  const { width } = Dimensions.get('window');
  const contentHeight = Math.ceil((width - 30) * (388 / 690));
  return contentHeight + 10;
};
// 记录所有视频播放记录时长的容器
let allVideo = {};
// 清空播放历史记录
export const videoClearHistory = () => {
  allVideo = {};
};
@connect(({ scrollEvent }) => ({ scrollEvent }), undefined, undefined, {
  withRef: true,
})
export default class VideoPanel extends PureComponent {
  static propTypes = {
    video: PropTypes.object,
    onItemPress: PropTypes.func,
    scrollReplay: PropTypes.bool,
  };

  static defaultProps = {
    video: {},
    onItemPress: _.noop,
    scrollReplay: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      replayShow: false, // 播放器是否显示
    };
    this.scrollReplay = this.props.scrollReplay;
    this.refVideoBox = null;
    this.refVideo = null;
    this.pagePauseListener = null;
    this.pageResumeListener = null;
    this.bury = getTimeFn(this);
    this.source = (() => {
      // 视频源
      const { video = {} } = this.props;
      const { source = '' } = video;
      return source;
    })();
    // 说明视频还没初始化播放， 所以赋值空对象
    allVideo[this.source] = {};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.scrollEvent === this.props.scrollEvent) {
      return false;
    }
    if (this.scrollReplay) {
      this.replayController();
    }
  }
  componentDidMount() {
    if (this.scrollReplay) {
      setTimeout(() => {
        this.replayController();
        eventEmitter.on('tabChange', this.tabChange);
        // 离开页面
        this.pagePauseListener = WBAPP.addListener('view_pause', () => {
          if (this.isRepalying()) {
            //this.pause();
            //WBAPP.toast({ message: '出去' });
          }
        });
        // 进入页面
        this.pageResumeListener = WBAPP.addListener('view_resume', () => {
          if (this.isRepalying()) {
            //this.play();
            //WBAPP.toast({ message: '进来' });
          }
        });
      });
    }
  }
  componentWillUnmount() {
    // 销毁组件时，解除所有监听
    if (this.scrollReplay) {
      eventEmitter.off('tabChange', this.tabChange);
      this.pagePauseListener.remove();
      this.pageResumeListener.remove();
    }
  }
  tabChange = ({ item = {} }) => {
    if (!this.isRepalying()) return;
    // 这个函数主要处理在切换tab时，视频要暂停，切换回来要继续播放
    // 获取切换tab的标记
    const { tabName } = item;
    if (tabName === 'buluo') {
      this.play();
    } else {
      this.pause();
    }
  };
  isRepalying = () => {
    // 如果当前时间为0，说明播放完了，若果为undefined，说明视频还没初始化播放
    const { currentTime } = allVideo[this.source];
    // 是否在播放中 和 组件是否存在
    // 在帖子列表所有视频中，只有在中线的视频的组件 this.refVideo 为真，其他的都被销毁掉了
    return currentTime > 0 && this.refVideo;
  };
  replayController() {
    // x = ?
    // y = ?
    // width = 当前组件的宽度
    // height = 当前组件的高度
    // pageX = 当前组件距离左侧的距离
    // pageY = 当前组件距离顶部的距离
    UIManager.measure(findNodeHandle(this.refVideoBox), (x, y, width, height, pageX, pageY) => {
      const { height: wh } = Dimensions.get('window');
      // 进入中线，中线：是把屏幕平均分成上下两部分的线
      const maxHeight = wh / 2;
      // 退出中线
      const minHeight = maxHeight - height;
      // 当视频触碰中线时播放
      if (maxHeight > pageY && pageY > minHeight) {
        !this.state.replayShow &&
          this.setState({ replayShow: true }, () => {
            // 因为ios的seek没有做容错处理，所以seek必须设置在视频准备完成后在设置
            // 使用setTimeout可以替换onPrepared的钩子，可能比钩子还可靠
            // 后期如果ios修复，可以尝试去掉setTimeout
            setTimeout(() => {
              this.play();
              this.refVideo.seek(allVideo[this.source]?.currentTime || 0);
            });
          });
      } else {
        // 脱离中线停止播放
        if (this.state.replayShow) {
          this.pause();
          this.setState({ replayShow: false });
        }
      }
    });
  }
  play = () => {
    this.time = Date.now();
    this.refVideo.play();
  };
  pause = () => {
    const time = Date.now() - this.time;
    //WBAPP.toast({ message: `${time}` });
    this.refVideo.pause();
  };
  onVideoProgress = ({ currentTime, duration }) => {
    // currentTime当前时间，duration 总时长
    // 实时记录播放进度
    // console.log(currentTime, duration)
    //WBAPP.toast({ message: `${currentTime} - ${duration}` });
    this.bury({ currentTime, duration });
    allVideo[this.source] = { currentTime, duration };
  };
  // 播放结束
  onCompleted = () => {
    // 如果播放结束，要把当前时间重置为 0
    this.videoEnd = true;
    this.pause();
    allVideo[this.source].currentTime = 0;
  };
  onItemPressCurring = () => {
    const { onItemPress } = this.props;
    // 如果有视频播放器，并且视频没有播放完，需要记录当前时间
    // 以便视频详情（沉浸视频）能够获取当前视频的进度
    if (this.scrollReplay) {
      AsyncStorage.setItem(
        'current_scroll_video',
        JSON.stringify({
          source: this.source,
          currentTime: allVideo[this.source]?.currentTime,
        }),
      );
    }
    setTimeout(() => {
      onItemPress && onItemPress();
    });
  };
  render() {
    const { video = {}, onItemPress } = this.props;
    const { state, duration = 0, staticPoster, poster, source } = video;

    const { width } = Dimensions.get('window');
    const contentWidth = Math.round(width - 30);
    const contentHeight = Math.ceil((width - 30) * (388 / 690));
    const ratio = (width - 30 - 10) / 3;

    // 视频封面增加人脸识别
    const posterUri = staticPoster?.pic
      ? faceRecognizeAndOptimize(staticPoster, contentWidth, contentHeight)
      : resolveImageURL(poster);
    return (
      <View
        style={styles.panel}
        ref={(ref) => {
          this.refVideoBox = ref;
        }}
      >
        {state === 1 ? (
          <View style={styles.container}>
            <TouchableOpacity
              style={[
                styles.video,
                {
                  height: contentHeight,
                  width: '100%',
                  maxHeight: ratio * 2 + 5,
                  maxWidth: ratio * 3 + 10,
                },
              ]}
              activeOpacity={0.7}
              onPress={this.onItemPressCurring}
              disabled={!onItemPress}
            >
              {this.state.replayShow && this.scrollReplay ? (
                <>
                  {/* 这里需要一个遮罩，确保不会被点击到而出现控件 */}
                  <View style={[styles.replayShade]}></View>
                  <Video
                    ref={(ref) => {
                      this.refVideo = ref;
                    }}
                    pointerEvents="none"
                    controlsAvailable={true}
                    needCache={true}
                    style={[styles.replay]}
                    url={source}
                    onVideoProgress={this.onVideoProgress}
                    onCompleted={this.onCompleted}
                  />
                </>
              ) : (
                <>
                  <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={{
                      uri: posterUri,
                    }}
                  />
                  <Image
                    style={styles.iconImage}
                    resizeMode="cover"
                    source={{
                      uri: 'http://a.58cdn.com.cn/app58/icons/videoIcon.png',
                    }}
                  />
                </>
              )}
              <View style={[styles.timeContainer]}>
                <Text style={styles.timeText}>{calcDuration(duration)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.container}
            onPress={onItemPress}
            disabled={!onItemPress}
          >
            <View
              style={[
                styles.fakePoster,
                {
                  height: contentHeight,
                  width: '100%',
                },
              ]}
            >
              <Text>视频转码中...</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
