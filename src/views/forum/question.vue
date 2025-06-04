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
                :id="this.id"
                :interface="'question'"
                @setInfo="setInfo"
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
                :qid="id"
                :aid="item.id"
                interface="question"
                :uid="item.userId"
                :content="item.content"
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
                v-if="!showDialogAnswer"
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
                        {{ isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}
                    </v-icon>
                    好问题 
                    {{ likeCount }}
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
            // data
            id: 0,
            title: '',
            likeCount: 0,
			isLiked: false,
            answerCount: 0,
            allData: [],

            // control
            isLoading: false,
            noMore: false,
            currentPageNum: 1,
            itemsPerPage: 4,
            /// answerCard
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
                this.fetchAnswers();
            }
        },
        async fetchAnswers() {
            if (this.noMore || this.isLoading) {
                return
            }
            this.isLoading = true
            try {
                const response = await this.$Axios({
                    method: 'get',
                    url: '/qaService/answer/list',
                    params: {
                        questionId: this.id,
                        page: this.currentPageNum,
                        pageSize: this.itemsPerPage,
                    },
                });
                
                let data = response.data.msg.content
                // console.log("question: ", data)
                this.allData = [...this.allData, ...data]
                if (this.allData.length >= this.answerCount) {
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
            // localStorage.setItem('id', this.id)
            // this.$router.push('./answerWrite')
            this.showDialogAnswer = true;
            // this.toupdate_answerId = answer.id;
            // this.toupdate_answerContent = answer.content;

            // console.log(this.toupdate_answerContent)

            this.toupdate_answer_questionId = this.id;
            this.toupdate_answer_questionTitle = this.title;
        },
        
        handleAnswerClose({ shouldRefreshAnswer }) {
            this.showDialogAnswer = false;
            this.toupdate_answerId = 0;
            this.toupdate_answerContent = "";
            this.toupdate_answer_questionId = 0;
            this.toupdate_answer_questionTitle = "";
            if (shouldRefreshAnswer) {
                this.$router.go(0)
            }
        },
        async goodQuestion() {
            let isCancel = 0
            if (this.isLiked) {
                this.isLiked = false;
                isCancel = 1
            } else {
                this.isLiked = true;
            }
            this.$Axios({
                method: 'post',
                url: '/qaService/isLiked/evaluateQuestion',
                params: {
                    questionId: this.id,
                    isCancel: isCancel,
                    isLike: 1
                },
            }).then(response => {
                this.likeCount = response.data.msg.likeCount
            }).catch(error => {
                console.error('点赞失败:', error)
            })
        },

        toAnswer(aid) {
            localStorage.setItem('topAid', aid)
            this.$router.push({ name: 'forumAnswer' });
        },
        setInfo(likeCount, isLiked, title, answerCount) {
            this.isLiked = isLiked
            this.likeCount = likeCount
            this.title = title
            this.answerCount = answerCount
        }
    },
    async created() {
        this.id = Number(localStorage.getItem('id'))
        this.fetchAnswers()
    },
}
</script>
<style scoped lang="less">
.forum__bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>