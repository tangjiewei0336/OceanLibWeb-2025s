<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
.pullRefresh {
  margin-bottom: 40px;
}
.myUpload {
  margin: 10px 10px 0px 10px;
  &__fileBox {
    padding: 10px;
  }
}
.myDocfinished {
  margin: 10px 10px 0px 10px;
}
.myAsk {
  margin: 10px 10px 0px 10px;
  &__questionBox {
    padding: 10px;
  }
}
.question-box__tags {
  margin: 0px 10px 0px 10px;
  display: flex;
  flex-wrap: wrap;

  .question-box__tag {
    margin-right: 6px;
    margin-bottom: 4px;
  }
}
.myQuestionfinished {
  margin: 10px 10px 0px 10px;
}
</style>
<style lang="less" scoped>
/deep/ .v-data-table > .v-data-table__wrapper > table {
  width: 550px !important;
}
/deep/ .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 12px;
}
/deep/ .van-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <div class="page">
    <van-nav-bar ref="toolbar" title="我的内容" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>
    <van-tabs sticky class="full" :offset-top="tabsOffset">
      <van-tab title="文档" name="0" class="full">
        <van-pull-refresh class="pullRefresh full" v-model="content.fileList.refreshing" @refresh="getMyFileList(true)">
          <van-list v-model="content.fileList.loading" :finished="content.fileList.finished" @load="getMyFileList()" class="full">
            <div v-for="fileInfo in myFileList" :key="fileInfo.fileID">
              <v-card class="myUpload" outlined>
                <v-fileBox class="myUpload__fileBox" :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
                  :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
                  :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
                  :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames"></v-fileBox>
                <v-card-actions>
                  <v-btn fab dark x-small color="primary" @click="changeFileInfo(fileInfo.fileID)">
                    <v-icon>mdi-note-edit</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="primary">
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="warning">
                    <v-icon>mdi-file-cancel</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="fileInfo.show = !fileInfo.show;$forceUpdate();">
                    <v-icon>{{ fileInfo.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="fileInfo.show">
                    <v-divider></v-divider>
                    <v-simple-table dense style="width:500px">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">下载量</th>
                            <th class="text-left">点赞量</th>
                            <th class="text-left">收藏量</th>
                            <th class="text-left">评论量</th>
                            <th class="text-left">精品</th>
                            <th class="text-left">上传时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="">{{fileInfo.fileExtraEntity.downloadNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.likeNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.collectionNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.commentNum}}次</td>
                            <td>
                              <v-icon :color="fileInfo.fileExtraEntity.isProCert==0?'warning':'success'" size="16">
                                mdi-circle
                              </v-icon>
                            </td>
                            <td>{{fileInfo.uploadDate}}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </v-expand-transition>
              </v-card>
            </div>
            <template #finished>
              <div class="myDocfinished">
                <!--若无文件则显示空提示-->
                <van-empty description="您还没有已经发布的文档呢" v-if="myFileList.length==0">
                  <template slot="image">
                    <img src="@/images/empty-picture/no_record.svg" />
                  </template>
                  <template>
                    <v-btn color="primary" small class="mr-2" to="/uploadFile">上传更多文档
                      <v-icon right dark>mdi-file-upload</v-icon>
                    </v-btn>
                    <v-btn color="primary" small>查看草稿箱文档
                      <v-icon right dark>mdi-seal-variant</v-icon>
                    </v-btn>
                  </template>
                </van-empty>
                <!-- <div v-else class="notice-nomore__text">没有更多已经发布的文档了</div>
                <v-btn color="primary" small class="mr-2" to="/uploadFile">上传更多文档
                  <v-icon right dark>mdi-file-upload</v-icon>
                </v-btn>
                <v-btn color="primary" small>查看草稿箱文档
                  <v-icon right dark>mdi-seal-variant</v-icon>
                </v-btn> -->
                <div v-else description="没有更多已经发布的文档了">
                  <v-btn color="primary" small class="mr-2" to="/uploadFile">上传更多文档
                    <v-icon right dark>mdi-file-upload</v-icon>
                  </v-btn>
                  <v-btn color="primary" small>查看草稿箱文档
                    <v-icon right dark>mdi-seal-variant</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <!-- <van-tab title="专栏" name="1">
        <van-empty description="程序猿们正在努力开发中">
          <template slot="image">
            <img src="@/images/empty-picture/no_internet.svg" />
          </template>
          <v-btn color="primary" small class="mr-2" to="/about">加入我们
            <v-icon right dark>mdi-account-cog</v-icon>
          </v-btn>
        </van-empty>
      </van-tab> -->
      <van-tab title="提问" name="1" class="full">
        <van-pull-refresh class="pullRefresh full" v-model="content.questionList.refreshing" @refresh="getMyQuestionList(true)">
          <van-list v-model="content.questionList.loading" :finished="content.questionList.finished" @load="getMyQuestionList" class="full">
            <div v-for="question in myQuestionList.filter(q => !q.isDeleted)" :key="question.bindId">
              <v-card class="myAsk" outlined>
                <v-questionBox
                  :key="question.bindId"
                  v-bind="question"
                  class="myAsk__questionBox"
                />
                <div class="question-box__tags" v-if="question.tagIds">
                  <van-tag
                    v-for="tag in question.tagIds"
                    :key="tag"
                    type="primary"
                    class="question-box__tag"
                  >
                    {{ tag }}
                  </van-tag>
                </div>
                <!-- 操作按钮 -->
                <v-card-actions>
                  <!-- <v-btn fab dark x-small color="primary" @click="changeQuestionInfo(question.bindId)"> -->
                  <v-btn fab dark x-small color="primary" @click= "OpenAskCard(question.bindId)">
                    <v-icon>mdi-note-edit</v-icon>
                  </v-btn>
                  <!-- <v-btn fab dark x-small color="primary">
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn> -->
                  <v-btn fab dark x-small color="primary"  @click="hideQuestion(question.bindId)">
                    <v-icon>mdi-eye-off</v-icon>
                  </v-btn>
                  <v-btn fab dark x-small color="error"  @click="confirmDeleteQuestion(question.bindId)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="question.show = !question.show; $forceUpdate();">
                    <v-icon>{{ question.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-card-actions>

                <!-- 展开内容 -->
                <v-expand-transition>
                  <div v-show="question.show">
                    <v-divider></v-divider>
                    <v-simple-table dense style="width: 500px">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">更新时间</th>
                            <th class="text-left">上传时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{{ formatTime(question.updateTime) }}</td>
                            <td>{{ formatTime(question.createTime) }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </v-expand-transition>
              </v-card>
            </div>
            <template #finished>
              <div class="myQuestionfinished">
                <van-empty description="您还没有发布任何问题" v-if="myQuestionList.length==0">
                  <template slot="image">
                    <img src="@/images/empty-picture/no_record.svg" />
                  </template>
                  <template>
                    <v-btn color="primary" small class="mr-2" @click="showDialog = true">去提问
                      <v-icon right dark>mdi-comment-question</v-icon>
                    </v-btn>
                    <v-btn color="primary" small :to="{ path: '/myDraftQuestion', query: { tab: '1' } }">查看草稿箱问题
                      <v-icon right dark>mdi-seal-variant</v-icon>
                    </v-btn>
                  </template>
                </van-empty>
                <div v-else description="没有更多已经发布的问题了">
                  <v-btn color="primary" small class="mr-2" @click="showDialog = true">去提问
                    <v-icon right dark>mdi-comment-question</v-icon>
                  </v-btn>
                  <v-btn color="primary" small :to="{ path: '/myDraftQuestion', query: { tab: '1' } }">查看草稿箱问题
                    <v-icon right dark>mdi-seal-variant</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>

      <v-dialog
				v-model="showDialog"
				fullscreen
				hide-overlay
				transition="dialog-bottom-transition"
				persistent
			>
				<AskCard 
          @close="handleAskCardClose"
          :questionId="this.toupdate_questionId"
          />
      </v-dialog>
        
      <v-dialog
				v-model="showDialogAnswer"
				fullscreen
				hide-overlay
				transition="dialog-bottom-transition"
				persistent
        >
				<AnswerCard 
          @close="handleAnswerClose"
          :answerId="this.toupdate_answerId"
          :answerContent="this.toupdate_answerContent"
          :questionId="this.toupdate_answer_questionId"
          :questionTitle="this.toupdate_answer_questionTitle"
        />
			</v-dialog>

      <van-tab title="回答" name="2" class="full">
        <van-pull-refresh class="pullRefresh full" v-model="content.answerList.refreshing" @refresh="getMyAnswerList(true)">
          <van-list v-model="content.answerList.loading" :finished="content.answerList.finished" @load="getMyAnswerList()" class="full">
            <div v-for="answer in myAnswerList" :key="answer.id">
              <v-card class="myAsk" outlined>
                <v-answerBox
                  :key="answer.id"
                  v-bind="answer"
                  class="myAsk__questionBox"
                />
                <!-- <div class="question-box__tags">
                  <van-tag
                    v-for="tag in question.tagIds"
                    :key="tag"
                    type="primary"
                    class="question-box__tag"
                  >
                    {{ tag }}
                  </van-tag>
                </div> -->
                <!-- 操作按钮 -->
                <v-card-actions>
                  <!-- <v-btn fab dark x-small color="primary" @click="changeQuestionInfo(question.bindId)"> -->
                  <v-btn fab dark x-small color="primary" @click="handleAnswerUpdate(answer)">
                    <v-icon>mdi-note-edit</v-icon>
                  </v-btn>
                  <!-- <v-btn fab dark x-small color="primary">
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn> -->
                  <v-btn fab dark x-small color="error" @click="confirmDeleteAnswer(answer.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="answer.show = !answer.show; $forceUpdate();">
                    <v-icon>{{ answer.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-card-actions>

                <!-- 展开内容 -->
                <v-expand-transition>
                  <div v-show="answer.show">
                    <v-divider></v-divider>
                    <v-simple-table dense style="width: 500px">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">更新时间</th>
                            <th class="text-left">上传时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{{ formatTime(answer.updateTime) }}</td>
                            <td>{{ formatTime(answer.createTime) }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </v-expand-transition>
              </v-card>
            </div>
            <template #finished>
              <div class="myQuestionfinished">
                <van-empty description="您还没有回答任何问题" v-if="myAnswerList.length==0">
                  <template slot="image">
                    <img src="@/images/empty-picture/no_record.svg" />
                  </template>
                  <template>
                    <v-btn color="primary" small class="mr-2" to="/forum/recommend">回答问题
                      <v-icon right dark>mdi-reply</v-icon>
                    </v-btn>
                    <!-- <v-btn color="primary" small>查看草稿箱问题
                      <v-icon right dark>mdi-seal-variant</v-icon>
                    </v-btn> -->
                  </template>
                </van-empty>
                <div v-else description="没有更多已经回答的问题了">
                  <v-btn color="primary" small class="mr-2" to="/forum/recommend">回答问题
                    <v-icon right dark>mdi-reply</v-icon>
                  </v-btn>
                  <!-- <v-btn color="primary" small>查看草稿箱问题
                    <v-icon right dark>mdi-seal-variant</v-icon>
                  </v-btn> -->
                </div>
              </div>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>

      <van-tab title="帮帮帖" name="3">
        <van-empty description="程序猿们正在努力开发中">
          <template slot="image">
            <img src="@/images/empty-picture/no_internet.svg" />
          </template>
          <v-btn color="primary" small class="mr-2" to="/about">加入我们
            <v-icon right dark>mdi-account-cog</v-icon>
          </v-btn>
        </van-empty>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import fileBox from '../../components/fileBox';
import questionBox from '../../components/questionBox';
import answerBox from '../../components/answerBox';
import { Dialog } from 'vant';
import AskCard from '@/components/forum/AskCard.vue'
import AnswerCard from '@/components/forum/AnswerCard.vue'

export default {
  components: {
    'v-fileBox': fileBox,
    'v-questionBox': questionBox,
    'v-answerBox': answerBox,
    AskCard,
    AnswerCard,
  },
  data() {
    return {
      toupdate_questionId: 0,
      toupdate_answerId: 0,
      toupdate_answerContent: "",
      toupdate_answer_questionId: 0,
      toupdate_answer_questionTitle: "",

      tabsOffset: 0,
      showDialog: false,
      showDialogAnswer: false,
      myFileList: [
        {
          "fileID": 1,
          "title": "Web应用开发期末考试通俗串讲",
          "abstractContent": "中南大学Web应用开发技术期末考试Servlet部分的笔记资料",
          "size": 5901052,
          "previewPictureObjectName": "PreviewDocument/LDVY5NB0IJVAMUVIFZTLUUHC3IXKORLZ_preview_img.jpg",
          "fileType": "docx",
          "uploadUsername": "admin",
          "uploadDate": "2022-02-20 18:36:01",
          "realObjectName": "OriginalDocument/LDVY5NB0IJVAMUVIFZTLUUHC3IXKORLZ.docx",
          "previewPdfObjectName": "PreviewDocument/LDVY5NB0IJVAMUVIFZTLUUHC3IXKORLZ_preview.pdf",
          "paymentMethod": 2,
          "paymentAmount": 4,
          "isAllowAnon": 1,
          "isAllowVipfree": 1,
          "isAllowComment": 1,
          "hideScore": 0.0086,
          "folderID": null,
          "isApproved": 1,
          "indexString": "1-1-3",
          "typeID": 1,
          "tagNames": [
            "期末复习"
          ],
          "fileExtraEntity": {
            "fileID": 1,
            "score": 5,
            "ratersNum": 1,
            "readNum": 14,
            "likeNum": 2,
            "dislikeNum": 0,
            "downloadNum": 1,
            "collectionNum": 1,
            "commentNum": 5,
            "isProCert": 0,
            "isOfficial": 0,
            "isOriginal": 1,
            "isVipIncome": 0,
            "originalAuthor": "",
            "copyrightNotice": "BY-NC-ND-SA"
          },
          "fileCheckEntity": null
        }
      ],
      myQuestionList:[],
      // myQuestionList: [
      //   {
      //     id: 'q12345',
      //     title: '如何使用 Vue 和 Quill 构建知乎风格的提问界面？',
      //     content: `
      //       <p>我正在开发一个类似知乎的前端页面，使用 Vue 2 和 Quill 作为富文本编辑器。</p>
      //       <p>想知道如何实现知乎那种浮动提问卡片、全屏输入界面、标签选择和悬赏设置功能。</p>
      //       <p>有经验的朋友可以分享一下做法或思路吗？</p>
      //     `,
      //     userId: 'user_001',
      //     createTime: '2025-05-21T10:30:00.000Z',
      //     updateTime: '2025-05-21T10:45:00.000Z',
      //     isDeleted: false,
      //     isPosted: true,
      //     isHidden: false,
      //     rewardPoints: 50,
      //     answerCount: 3,
      //     viewCount: 128,
      //     tagIds: ['Vue', '前端开发', '富文本编辑器', '知乎风格'],
      //     attachmentIds: ['att001', 'att002'],
      //   },
      //   {
      //     id: 'q12346',
      //     title: '如何使用 Vue 和 Quill 构建知乎风格的提问界面？',
      //     content: `
      //       <p>这是描述</p><img src="xxx"/><p>这是描述</p><img src="xxx"/><img src="yyy"/><p>结束</p>
      //     `,
      //     userId: 'user_001',
      //     createTime: '2025-05-21T10:30:00.000Z',
      //     updateTime: '2025-05-21T10:45:00.000Z',
      //     isDeleted: false,
      //     isPosted: true,
      //     isHidden: false,
      //     rewardPoints: 50,
      //     answerCount: 3,
      //     viewCount: 128,
      //     tagIds: ['Vue', '前端开发', '富文本编辑器', '知乎风格'],
      //     attachmentIds: ['att001', 'att002'],
      //   },
      // ],
      myAnswerList: [
        // {
        //   id: 111,
        //   content: `
        //     <p>这是描述</p><img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg"/><p>这是描述</p><img src="xxx"/><img src="yyy"/><p>结束</p>
        //   `,
        //   userId: 'user_001',
        //   createTime: '2025-05-21T10:30:00.000Z',
        //   updateTime: '2025-05-21T10:45:00.000Z',
        //   likeCount: 50,
        //   commentCount: 3,
        //   question: { id: 1, title: 'Vue 与 React 的主要区别？',content: 'dwdoai' }
        // },
      ],
      content: {
        fileList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        questionList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        answerList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        folderList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        noteList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
      },
    };
  },
  mounted() {
    this.tabsOffset = this.$refs['toolbar'].height;
  },
  methods: {
    OpenAskCard(bindId) {
      this.showDialog = true;
      this.toupdate_questionId = bindId;
      console.log(this.toupdate_questionId)
    },
    handleAskCardClose({ shouldRefresh }) {
      this.showDialog = false;
      this.toupdate_questionId = 0;
      if (shouldRefresh) {
        this.getMyQuestionList(true); // 重新加载问题列表
      }
    },
    handleAnswerClose({ shouldRefresh }) {
      this.showDialogAnswer = false;
      this.toupdate_answerId = 0;
      this.toupdate_answerContent = "";
      this.toupdate_answer_questionId = 0;
      this.toupdate_answer_questionTitle = "";
      if (shouldRefresh) {
        this.getMyAnswerList(true); // 重新加载回答列表
      }
    },
    handleAnswerUpdate(answer) {
      this.showDialogAnswer = true;
      this.toupdate_answerId = answer.id;
      this.toupdate_answerContent = answer.content;
      console.log(this.toupdate_answerContent)
      this.toupdate_answer_questionId = answer.questionId;
      this.toupdate_answer_questionTitle = answer.question.title;
    },
    back() {
      this.$router.go(-1); //返回上一层
    },
    getMyFileList(isRefreshing = false) {
      if (isRefreshing) {
        this.content.fileList.pageNum = 1;
        this.content.fileList.finished = false;
      }
      // this.$Axios({
      //   method: 'get',
      //   url: '/docInfoService/getMyFileList',
      //   params: {
      //     isFolder: false,
      //     pageNum: this.content.fileList.pageNum,
      //     pageSize: 4,
      //   },
      // }).then((response) => {
      //   if (!isRefreshing) {
      //     this.myFileList.push(...response.data.msg.list);
      //   } else {
      //     this.myFileList = response.data.msg.list;
      //   }
      //   this.myFileList.map((data) => {
      //     data.show = false;
      //   });
      //   if (response.data.msg.isLastPage) {
      //     this.content.fileList.finished = true;
      //   } else {
      //     this.content.fileList.pageNum += 1;
      //   }
      //   this.content.fileList.loading = false;
      //   this.content.fileList.refreshing = false;
      // });
      this.content.fileList.finished = true;
      this.content.fileList.loading = false;
      this.content.fileList.refreshing = false;
    },
    changeFileInfo(fileID) {
      this.$router.push({
        path: '/uploadInfo',
        query: {
          fileID: fileID,
        },
      });
    },

    formatTime(datetime) {
      const d = new Date(datetime);
      const date = d.toLocaleDateString(); // 2025/5/21
      const time = d.toLocaleTimeString().slice(0, 5); // eg. 15:30
      return `${date} ${time}`;
    },

    getMyQuestionList(isRefreshing = false) {
      if (isRefreshing) {
        this.content.questionList.pageNum = 1;
        this.content.questionList.finished = false;
      }
      this.$Axios({
        method: 'get',
        url: '/qaService/question/list',
        params: {
          page: this.content.questionList.pageNum,
          pageSize: 6,
          username: localStorage.getItem('username'),
          sort: 0,
          includeDeleted: 0,
        },
      }).then((response) => {
        // console.log(response.data.msg.content)
        if (!isRefreshing) {
          this.myQuestionList.push(...response.data.msg.content);
        } else {
          this.myQuestionList = response.data.msg.content;
        }
        this.myQuestionList.map((data) => {
          data.show = false;
        });
        if (response.data.msg.last) {
          this.content.questionList.finished = true;
        } else {
          this.content.questionList.pageNum += 1;
        }
        this.content.questionList.loading = false;
        this.content.questionList.refreshing = false;
      }).catch(() => {
        // 失败时也要关闭状态
        this.content.questionList.loading = false;
        this.content.questionList.refreshing = false;
      });
      // this.content.questionList.finished = true;
      // this.content.questionList.loading = false;
      // this.content.questionList.refreshing = false;
    },
    // changeQuestionInfo(questionId) {
    //   this.$router.push({
    //     path: '/updateQuestionInfo',
    //     query: {
    //       questionId: questionId,
    //     },
    //   });
    // },
    hideQuestion(questionId) {
      Dialog.confirm({
        title: '确认隐藏',
        message: '此操作会将该问题移至“草稿箱”，隐藏后可在草稿箱查看，是否继续？',
        confirmButtonText: '确定隐藏',
        cancelButtonText: '我再想想',
      })
      .then(() => {
        this.doHideQuestion(questionId);
      })
      .catch(() => {
      });
    },
    doHideQuestion(questionId) {
      this.$Axios({
        method: 'PUT',
        url: '/qaService/question/update',
        params: {
          questionId: questionId,
          isPost: 0,
        },
      })
      .then((response) => {
        const data = response.data;
        // console.log(data)
        if (data.state === "SUCCESS") {
          this.myQuestionList = this.myQuestionList.filter(q => q.bindId !== questionId);
          this.$toast.success('已成功隐藏该问题');
        } else {
          this.$toast.fail(data.msg || '隐藏失败');
        }
      })
      .catch(err => {
        console.error(err);
        this.$toast.fail('网络错误，隐藏失败');
        this.$set(this.myQuestionList[idx], 'hiding', false);
      });
    },
    confirmDeleteQuestion(questionId) {
      Dialog.confirm({
        title: '确认删除',
        message: '此操作不可恢复，是否确定要删除这条提问？',
      })
      .then(() => {
        this.deleteQuestion(questionId);
      })
      .catch(() => {
      });
    },
    deleteQuestion(questionId) {
      this.$Axios({
        method: 'DELETE',
        url: '/qaService/question/delete',
        params: { questionId },
      })
      .then(response => {
        if (response.data.state === "SUCCESS") {
          // 从列表移除
          this.myQuestionList = this.myQuestionList.filter(q => q.bindId !== questionId);
          this.$toast.success('已成功删除该问题');
          // this.getMyQuestionList(true);
        } else {
          this.$toast.fail(response.data.msg || '删除失败');
        }
      })
      .catch(() => {
        this.$toast.fail('网络错误，删除失败');
      });
    },
    getMyAnswerList(isRefreshing) {
      if (isRefreshing) {
        this.content.answerList.pageNum = 1;
        this.content.answerList.finished = false;
      }
      this.$Axios({
        method: 'get',
        url: '/qaService/answer/myAnswers',
        params: {
          page: this.content.answerList.pageNum,
          pageSize: 6,
          // username: localStorage.getItem('username'),
        },
      }).then((response) => {
        console.log(response.data.msg.content)
        if (!isRefreshing) {
          this.myAnswerList.push(...response.data.msg.content);
        } else {
          this.myAnswerList = response.data.msg.content;
        }
        this.myAnswerList.map((data) => {
          data.show = false;
        });
        if (response.data.msg.last) {
          this.content.answerList.finished = true;
        } else {
          this.content.answerList.pageNum += 1;
        }
        this.content.answerList.loading = false;
        this.content.answerList.refreshing = false;
      });
    },
    confirmDeleteAnswer(answerId) {
      Dialog.confirm({
        title: '确认删除',
        message: '此操作不可恢复，是否确定要删除这条回答？',
      })
      .then(() => {
        this.deleteAnswer(answerId);
      })
      .catch(() => {
      });
    },
    deleteAnswer(answerId) {
      this.$Axios({
        method: 'DELETE',
        url: '/qaService/answer/delete',
        params: { answerId },
      })
      .then(response => {
        if (response.data.state === "SUCCESS") {
          // 从列表移除
          this.myAnswerList = this.myAnswerList.filter(q => q.id !== answerId);
          this.$toast.success('已成功删除该回答');
        } else {
          this.$toast.fail(response.data.msg || '删除失败');
        }
      })
      .catch(() => {
        this.$toast.fail('网络错误，删除失败');
      });
    },
  },
};
</script>

<style scoped>
</style>