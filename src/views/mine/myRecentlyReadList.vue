<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
.fileBox {
  padding: 15px 20px;
  margin-bottom: 5px;
  background-color: @white;
}
.questionBox {
  padding: 15px 20px;
  margin-bottom: 5px;
  background-color: @white;
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="最近浏览" left-text="返回" left-arrow @click-left="back" fixed placeholder>
    </van-nav-bar>
    <van-tabs sticky class="full">
      <van-tab title="文档" name="0" class="full">
        <van-pull-refresh v-model="file_refreshing" @refresh="getRecentlyReadDocList()" class="full">
          <van-list v-model="file_loading" :finished="file_finished" @load="getRecentlyReadDocList()">
            <div v-for="fileInfo in fileList" :key="fileInfo.fileID" class="fileBox">
              <v-fileBox :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
                :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
                :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
                :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames"></v-fileBox>
            </div>
            <template #finished>
              <!--若无收藏夹则显示空提示-->
              <van-empty description="没有最近7天的浏览记录呢" v-if="fileList.length==0">
                <template slot="image">
                  <img src="@/images/empty-picture/no_record.svg" />
                </template>
              </van-empty>
              <div v-else class="notice-nomore__text">没有更多浏览记录了</div>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="问题" name="1" class="full">
        <van-pull-refresh v-model="question_refreshing" @refresh="getRecentlyReadQuestionList()" class="full">
          <van-list v-model="question_loading" :finished="question_finished" @load="getRecentlyReadQuestionList()">
            <div v-for="question in questionList" :key="question.fileID" class="questionBox">
              <v-questionBox
                :key="question.id"
                v-bind="question"
              />
            </div>
            <template #finished>
              <!--若无收藏夹则显示空提示-->
              <van-empty description="没有最近7天的浏览记录呢" v-if="fileList.length==0">
                <template slot="image">
                  <img src="@/images/empty-picture/no_record.svg" />
                </template>
              </van-empty>
              <div v-else class="notice-nomore__text">没有更多浏览记录了</div>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import fileBox from '../../components/fileBox';
import questionBox from '../../components/questionBox';

export default {
  components: {
    'v-fileBox': fileBox,
    'v-questionBox': questionBox,
  },
  data() {
    return {
      fileList: [],
      // mock
      questionList: [
        {
          id: 'q12345',
          title: '如何使用 Vue 和 Quill 构建知乎风格的提问界面？',
          content: `
            <p>我正在开发一个类似知乎的前端页面，使用 Vue 2 和 Quill 作为富文本编辑器。</p>
            <p>想知道如何实现知乎那种浮动提问卡片、全屏输入界面、标签选择和悬赏设置功能。</p>
            <p>有经验的朋友可以分享一下做法或思路吗？</p>
          `,
          userId: 'user_001',
          createTime: '2025-05-21T10:30:00.000Z',
          updateTime: '2025-05-21T10:45:00.000Z',
          isDeleted: false,
          isPosted: true,
          isHidden: false,
          rewardPoints: 50,
          answerCount: 3,
          viewCount: 128,
          tagIds: ['Vue', '前端开发', '富文本编辑器', '知乎风格'],
          attachmentIds: ['att001', 'att002'],
        },
        {
          id: 'q12345',
          title: '如何使用 Vue 和 Quill 构建知乎风格的提问界面？',
          content: `
            <p>我正在开发一个类似知乎的前端页面，使用 Vue 2 和 Quill 作为富文本编辑器。</p>
            <p>想知道如何实现知乎那种浮动提问卡片、全屏输入界面、标签选择和悬赏设置功能。</p>
            <p>有经验的朋友可以分享一下做法或思路吗？</p>
          `,
          userId: 'user_001',
          createTime: '2025-05-21T10:30:00.000Z',
          updateTime: '2025-05-21T10:45:00.000Z',
          isDeleted: false,
          isPosted: true,
          isHidden: false,
          rewardPoints: 50,
          answerCount: 3,
          viewCount: 128,
          tagIds: ['Vue', '前端开发', '富文本编辑器', '知乎风格'],
          attachmentIds: ['att001', 'att002'],
        },

      ],
      file_refreshing: false,
      file_loading: false,
      file_finished: false,
      question_refreshing: false,
      question_loading: false,
      question_finished: false,
    };
  },
  mounted() {
    this.getRecentlyReadDocList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getRecentlyReadDocList() {
      this.file_loading = true;
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getRecentlyReadList',
      }).then((response) => {
        this.fileList = response.data.msg;
        this.file_refreshing = false;
        this.file_loading = false;
        this.file_finished = true;
      });
    },
    getRecentlyReadQuestionList() {
      this.question_loading = true;
      this.$Axios({
        method: 'get',
        url: '/qaService/question/recentlyViewed',
      }).then((response) => {
        this.questionList = response.data.msg;
        this.question_refreshing = false;
        this.question_loading = false;
        this.question_finished = true;
      });
    },
  },
};
</script>

<style scoped>
</style>