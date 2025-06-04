<template>
    <div class="question">
        <ReturnHeader
            interface="question"
        />
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: calc(100vh - 120px);"
            @scroll.passive="handleScroll"
        >
            <QuestionCard
                :qid="this.qid"
                :interface="'question'"
                :qtitle="qtitle"
                :hotPoint="hotPoint"
                :qcontent="qcontent"
                :commentNum="commentNum"
                :browse="browse"
                :likeCount="qlikeCount"
            />
            <v-sheet 
				color="grey lighten-2" 
				height="3px" 
				width="95%"
                class="mx-auto"
                rounded="0"
			/>

            <ContentCard 
                v-for="(item, index) in paginatedData" 
                :key="index"
                :qid="qid"
                :aid="item.id"
                interface="question"
                :uid="item.userId"
                :content="item.content"
                :commentCount="item.commentCount"
                :likeCount="item.likeCount"
                :createTime="item.createTime"
                :avatar="item.avatar"
                @toAnswer="toAnswer"
            />

            <v-row
                justify="center"
                align="center"
                style="margin-top: 20px;"
            >
                <v-col cols="auto">
                    <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>

            <v-sheet
                class="d-flex justify-center"
                color="transparent"
                style="position: fixed; bottom: 70px; left: 0; right: 0; z-index: 1000;"
            >
                <v-btn
                    rounded
                    small
                    color="primary"
                    class="mx-2"
                    @click="handleAnswerUpdate"
                    :width="120"
                    :height="30"
                >
                    <v-icon left>mdi-pencil</v-icon>
                    写回答
                </v-btn>
                <v-btn
                    small
                    rounded
                    color="white"
                    class="mx-2 primary--text"
                    @click="goodQuestion"
                    :width="120"
                    :height="30"
                >
                    <v-icon left>
                        {{ qliked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}
                    </v-icon>
                    好问题 
                    {{ qlikeCount }}
                </v-btn>
            </v-sheet>
        </v-container>

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

        <div class="forum__bottom-nav">
        <v-bottom-navigation
            shift
            color="primary"
            grow
            v-model="navigation"
        >
            <v-btn link to="/index">
            <span>文库</span>
            <v-icon>mdi-text-box-search</v-icon>
            </v-btn>
            <v-btn link to="/wall">
            <span>互助</span>
            <v-icon>mdi-handshake</v-icon>
            </v-btn>
            <v-btn link to="/forum/recommend">
            <span>知乎</span>
            <v-icon>mdi-forum</v-icon>
            </v-btn>
            <v-btn link to="/mine">
            <span>我的</span>
            <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </v-bottom-navigation>
        </div>
    </div>
  </template>

<script>
import QuestionCard from '../../components/forum/QuestionCard.vue';
import ReturnHeader from '../../components/nav/ReturnHeader.vue';
import ContentCard from '../../components/forum/ContentCard.vue';
import AnswerCard from '@/components/forum/AnswerCard.vue'

export default {
    components: { QuestionCard, ReturnHeader, ContentCard, AnswerCard },
    data() {
        return {
            navigation: 2,
            qid: 0,
            qtitle: '',
            hotPoint: 0,
            qcontent: '',
            commentNum: 0,
            browse: 0,

            qlikeCount: 0,
			qliked: false,

            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 4,
            allData: [],

            showDialogAnswer: false,
            toupdate_answerId: 0,
            toupdate_answerContent: "",
            toupdate_answer_questionId: 0,
            toupdate_answer_questionTitle: "",
        }
    },
    computed: {
        paginatedData() {
            const end = this.allData.length
            return this.allData.slice(0, end)
        }
    },
    methods: {
        handleScroll() {
            const container = this.$refs.scrollContainer;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                this.fetchData();
            }
        },
        async fetchData() {
            if (this.noMore || this.isLoading) {
                return
            }
            this.isLoading = true
            try {
                const response = await this.$Axios({
                    method: 'get',
                    url: '/qaService/answer/list',
                    params: {
                        questionId: this.qid,
                        page: this.currentPageNum + 1,
                        pageSize: this.itemsPerPage,
                    },
                });
                
                let data = response.data.msg.content
                // console.log("answers: ", data)
                this.allData = [...this.allData, ...data]
                if (this.allData.length >= this.commentNum ||
                    this.allData.length < this.itemsPerPage
                ) {
                    this.noMore = true
                } else {
                    this.currentPageNum += 1
                }
                this.isLoading = false
            } catch(error) {
                this.isLoading = false
                console.error('请求失败:', error)
            }
        },
        handleAnswerUpdate() {
            // localStorage.setItem('qid', this.qid)
            // this.$router.push('./answerWrite')
            this.showDialogAnswer = true;
            // this.toupdate_answerId = answer.id;
            // this.toupdate_answerContent = answer.content;

            // console.log(this.toupdate_answerContent)

            this.toupdate_answer_questionId = this.qid;
            this.toupdate_answer_questionTitle = this.qtitle;
        },
        
        handleAnswerClose({ shouldRefreshAnswer }) {
            this.showDialogAnswer = false;
            this.toupdate_answerId = 0;
            this.toupdate_answerContent = "";
            this.toupdate_answer_questionId = 0;
            this.toupdate_answer_questionTitle = "";
            if (shouldRefreshAnswer) {
                this.fetchData(); // 重新加载回答列表
            }
        },

        async goodQuestion() {
            let isCancel = 0
            if (this.qliked) {
                this.qliked = false;
                isCancel = 1
            } else {
                this.qliked = true;
            }
            this.$Axios({
                method: 'post',
                url: '/qaService/like/evaluateQuestion',
                params: {
                    questionId: this.qid,
                    isCancel: isCancel,
                    isLike: 1
                },
            }).then(response => {
                this.qlikeCount = response.data.msg.likeCount
            }).catch(error => {
                console.error('点赞失败:', error)
            })
        },

        toAnswer(aid) {
            let id = 0
            for (; id < this.allData.length; id++) {
                if (this.allData[id].id == aid) break;
            }
            let resData = this.allData.slice(id, this.allData.length)
            console.log("res length: ", resData.length)
            // console.log("store, ", resData)
            localStorage.setItem('resData', JSON.stringify(resData))
            localStorage.setItem('aPage', this.currentPageNum)
            localStorage.setItem('aPageNum', this.itemsPerPage)
            localStorage.setItem('aNoMore', this.noMore)
            this.$router.push({ name: 'forumAnswer' });
        }
    },
    async created() {
        this.qid = Number(localStorage.getItem('qid'))
        this.qtitle = String(localStorage.getItem('qtitle'))
        this.hotPoint = Number(localStorage.getItem('hotPoint'))
        this.qcontent = String(localStorage.getItem('qcontent'))
        this.commentNum = Number(localStorage.getItem('commentNum'))
        this.browse = Number(localStorage.getItem('browse'))
        this.qlikeCount = Number(localStorage.getItem('likeCount'))
        this.qliked = Boolean(localStorage.getItem('qliked') == 'true')

        if (localStorage.getItem('Jump2Answer') == null) {
            this.fetchData()
        } else {
            let aid = Number(localStorage.getItem('Jump2Answer'));
            if (aid == -1) {
                this.fetchData()
                return;
            }
            while (true) {
                await this.fetchData()
                let find = false;
                let id = 0;
                for (; id < this.allData.length; id++) {
                    if (this.allData[id].id == aid) {
                        find = true;
                        break;
                    }
                }
                if (find) break;
            }
            localStorage.setItem('Jump2Answer', -1)
            this.toAnswer(aid)
        }
    },
}
</script>
<style scoped lang="less">
.forum__bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  /* 让内容不被导航栏遮挡，要给父级 content 区留出相同高度的底部 padding */
  /* 比如导航栏高度约为 56px，就在上层容器加 padding-bottom: 56px; */
}
</style>