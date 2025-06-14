<style scoped lang="less">
@import '~@/vant-variables.less';
.qsearch {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: #fafafa;
  height: 100%;
  &__input {
    height: 50px !important;
  }
  &__history {
    margin: 0px 20px 0px 20px;
  }
  &__suggest {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 15px 20px 0px 20px;
    &__icon {
      font-size: 20px;
    }
    &__content {
      flex: 1;
      margin-left: 10px;
    }
    &__searchnow {
      align-items: center;
      margin: 15px 20px 0px 20px;
    }
  }
  &__result {
    &__box {
      background: #fff;
      padding: 15px 20px;
      margin-top: 5px;
    }
  }
}
</style>
<style lang="less" scoped>
/deep/ .v-toolbar__content {
  padding: 0px 20px;
}
</style>
<template>
  <div class="qsearch">
    <van-nav-bar id="toolbar" title="搜索" left-text="返回" left-arrow @click-left="back" fixed placeholder>
    </van-nav-bar>

    <van-sticky :offset-top="0">
      <v-toolbar class="qsearch__input" color="#fff">
        <v-text-field v-model="keywords" prepend-inner-icon="mdi-magnify" placeholder="请输入你想搜索的问题" clearable @keydown="keydownListen" @input="suggest"
          @click:clear="restartQSearch" hide-details="auto"></v-text-field>
      </v-toolbar>
    </van-sticky>

    <!--当用户没有聚焦在搜索框、搜索框内没有输入任何字符时，不显示搜索建议-->
    <!--用户搜索输入产生建议时，立刻唤起搜索建议-->
    <div v-if="showSuggest">
      <div class="qsearch__suggest" v-for="(item,index) in suggestList" v-bind:key="index" @click="qsearchKeywords(item)">
        <v-icon class="qsearch__suggest__icon">mdi-magnify</v-icon>
        <div class="qsearch__suggest__content">{{item}}</div>
        <v-icon class="qsearch__suggest__icon">mdi-arrow-top-right</v-icon>
      </div>
      <div class="qsearch__suggest">
        <v-icon class="qsearch__suggest__icon" color="primary">mdi-cloud-search</v-icon>
        <a class="qsearch__suggest__content" @click="qsearch(false)">搜索「{{keywords}}」</a>
      </div>
    </div>

    <van-list class="qsearch__result" v-model="loading" :finished="finished" :immediate-check="true" @load="qsearch(true)" v-if="showResult && !showSuggest">
      <v-skeleton-loader type="article,article,article,article,article" v-if="initLoading"></v-skeleton-loader>
      <!-- <div class="qsearch__result__box" v-for="fileInfo in fileList" :key="fileInfo.fileID">
        <v-fileBox :fileID="fileInfo.fileID" :searchResultContent="fileInfo.content" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title"
          :fileType="fileInfo.fileType" :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.readNum" :score="fileInfo.score"
          :ratersNum="fileInfo.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount" :isVipIncome="fileInfo.isVipIncome"></v-fileBox>
      </div> -->
      <div class="qsearch__result__box" v-for="question in questionList" :key="question.fileID">
        <v-questionBox
          :key="question.id"
          v-bind="question"
        />
      </div>
            
      <template #finished>
        <!--若无合适的文件则显示空提示-->
        <van-empty :description="'抱歉没有找到与「'+keywords+'」相关的文档'" v-if="questionList.length==0">
          <template #image>
            <img src="@/images/empty-picture/no_search.svg" />
          </template>
          <template>
            <v-btn color="primary" small>
              去帮帮墙发求助帖
              <v-icon right dark>
                mdi-wall
              </v-icon>
            </v-btn>
          </template>
        </van-empty>
        <div v-else>
          <div class="notice-nomore__text">没有更多的结果了</div>
          <v-btn color="primary" small>
            去帮帮墙发求助帖
            <v-icon right dark>
              mdi-wall
            </v-icon>
          </v-btn>
        </div>
      </template>
    </van-list>
    <div v-show="!showSuggest && !showResult && (keywords=='' || keywords==null)">
      <v-qsearchHistory class="qsearch__history" ref="qsearchHistory" @onHistoryTagClick="qsearchKeywords">
      </v-qsearchHistory>
      <van-empty description="输入关键字开始检索">
        <template slot="image">
          <img src="@/images/empty-picture/no_search.svg" />
        </template>
      </van-empty>
    </div>
  </div>
</template>

<script>
// import fileBox from '@/components/fileBox';
import questionBox from '@/components/questionBox';
import qsearchHistory from './qsearchHistory.vue';

export default {
  name: 'qsearch',
  components: {
    // 'v-fileBox': fileBox,
    'v-questionBox': questionBox,
    'v-qsearchHistory': qsearchHistory,
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  },
  data() {
    return {
      keywords: '',
      startNum: 1,
      questionList: [],
      suggestList: [],
      showSuggest: false,
      showResult: false,
      initLoading: true,
      loading: false,
      finished: false,
      debounceTimer: null, // 防抖定时器
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    restartQSearch() {
      // 清除防抖定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      
      this.startNum = 1;
      this.questionList = [];
      this.suggestList = [];
      this.showSuggest = false;
      this.showResult = false;
      this.initLoading = true;
      this.loading = true;
      this.finished = false;
    },
    keydownListen(keyboardEvent) {
      if (keyboardEvent.key == 'Enter') {
        this.qsearch(false);
      }
    },
    suggest(item) {
      // 清除之前的定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      if (item == null || item == '') {
        this.restartQSearch();
        return;
      }
      
      this.showSuggest = true;
      
      // 设置防抖延迟，300ms后执行搜索建议请求
      this.debounceTimer = setTimeout(() => {
        this.$Axios({
          method: 'get',
          url: '/qaService/question/suggestTitle',
          params: {
            keyword: item,
            rows: 10,
          },
        }).then((response) => {
          // console.log(response)
          this.suggestList = response.data.msg;
        });
      }, 300);
    },
    qsearchKeywords(qsearchString) {
      this.keywords = qsearchString;
      this.qsearch(false);
    },
    qsearch(isContinueLoading) {
      this.showSuggest = false;
      this.$refs['qsearchHistory'].addHistory(this.keywords);

      this.loading = true;
      if (!isContinueLoading) {
        this.restartQSearch();
      }
      this.showResult = true;
      this.$Axios({
        method: 'get',
        url: '/qaService/question/search',
        params: {
          keywords: this.keywords,
          page: this.startNum,
          rows: 10,
        },
      }).then((response) => {
        let searchHits = response.data.msg.searchHits;
        let questionListTemp = searchHits.map((data) => {
          if (data.highlightFields != null) {
            if (data.highlightFields.abstractContent != null && data.highlightFields.abstractContent.length > 0) {
              data.content.abstractContent = data.highlightFields.abstractContent[0];
            }
            if (data.highlightFields.title != null && data.highlightFields.title.length > 0) {
              data.content.title = data.highlightFields.title[0];
            }
            if (data.highlightFields.content != null && data.highlightFields.content.length > 0) {
              data.content.content = data.highlightFields.content[0];
            }
          }
          return data.content;
        });

        this.questionList.push.apply(this.questionList, questionListTemp);
        this.startNum += 1;
        if (response.data.msg.totalHits < 10) {
          this.finished = true;
        }
        this.loading = false;
        this.initLoading = false;
      });
    },
    toPreview(fileID, abstractContent, title, isOpenDownload = false) {
      this.$router.push({
        path: '/preview',
        query: {
          fileID: fileID,
          abstractContent: abstractContent,
          title: title,
          isOpenDownload: isOpenDownload,
        },
      });
    },
  },
};
</script>

<style scoped>
</style>