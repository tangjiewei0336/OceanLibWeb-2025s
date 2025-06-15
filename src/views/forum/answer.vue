<template>
    <div>
        <ReturnHeader
            interface="answer"
            @writeAnswer="handleWriteAnswer"
        />
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: calc(100vh - 60px);"
            @scroll.passive="handleScroll"
        >
            <QuestionCard
                :id="this.qid"
                interface="answer"
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
                :qid="qid"
                :aid="item.id"
                interface="answer"
                :uid="item.userId"
                :content="item.content"
                :likeCount="item.likeCount"
                :createTime="item.createTime"
                :avatar="item.avatar"
                :isLiked="item.isLiked"
                :isDisliked="item.isDisliked"
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
                <v-btn link to="/forum/hot">
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
import AnswerCard from '@/components/forum/AnswerCard.vue';
import Mock from 'mockjs'

export default {
    components: { QuestionCard, ReturnHeader, ContentCard, AnswerCard },
    data() {
        return {
            navigation: 2,
            // data
            qid: 0,
            answerCount: 0,
            qlikeCount: 0,
			qliked: false,
            allData: [],

            // control
            isLoading: false,
            noMore: false,
            currentPageNum: 1,
            itemsPerPage: 4,

            topAid: 0,
            findTop: false,

            // AnswerCard 相关
            showDialogAnswer: false,
            toupdate_answerId: 0,
            toupdate_answerContent: "",
            toupdate_answer_questionId: 0,
            toupdate_answer_questionTitle: "",
        }
    },
    computed: {
        paginatedData() {
            return this.allData
        }
    },
    methods: {
        handleScroll() {
            const container = this.$refs.scrollContainer;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                this.formAnswers();
            }
        },
        async fetchAnswers() {
            try {
                const response = await this.$Axios({
                    method: 'get',
                    url: '/qaService/answer/list',
                    params: {
                        questionId: this.qid,
                        page: this.currentPageNum,
                        pageSize: this.itemsPerPage,
                    },
                });
                // console.log(response.data.msg.content)
                return response.data.msg.content
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
        async formAnswers() {
            if (this.noMore || this.isLoading) {
                return
            }
            this.isLoading = true
            while (!this.findTop) {                
                let data = await this.fetchAnswers()
                if (!this.findTop) {
                    let id = 0;
                    for (; id < data.length; id++) {
                        if (data[id].id == this.topAid) {
                            this.findTop = true;
                            break;
                        }
                    }
                    data = data.slice(id, data.length)
                }
                this.allData = [...this.allData, ...data]
                if ((this.currentPageNum * this.itemsPerPage) >= this.answerCount) {
                    this.noMore = true;
                    this.isLoading = false;
                    return;
                } else {
                    this.currentPageNum += 1;
                }
            }
            let data = await this.fetchAnswers()
            this.allData = [...this.allData, ...data]
            if ((this.currentPageNum * this.itemsPerPage) >= this.answerCount) {
                this.noMore = true;
            } else {
                this.currentPageNum += 1;
            }
            this.isLoading = false;
        },
        parseData(resData) {
            try {
                this.allData = JSON.parse(resData);
            } catch (e) {
                console.error('解析失败:', e);
                this.allDat = [];
            }
        },
        setInfo(likeCount, isLiked, title, answerCount) {
            this.answerCount = answerCount
        },
        
        // 处理写回答按钮点击
        handleWriteAnswer() {
            this.showDialogAnswer = true;
            this.toupdate_answer_questionId = this.qid;
            // 问题标题已在 created 中从 localStorage 获取
        },
        
        // 处理 AnswerCard 关闭
        handleAnswerClose({ shouldRefreshAnswer, newAnswerId }) {
            this.showDialogAnswer = false;
            this.toupdate_answerId = 0;
            this.toupdate_answerContent = "";
            this.toupdate_answer_questionId = 0;
            this.toupdate_answer_questionTitle = "";
            if (shouldRefreshAnswer) {
                // 如果创建了新回答，将其设为 topAid 并更新 localStorage
                if (newAnswerId) {
                    this.topAid = newAnswerId;
                    localStorage.setItem('topAid', newAnswerId);
                }
                // 重新获取数据而不是刷新整个页面
                this.refreshAnswerData();
            }
        },
        
        // 重新获取答案数据
        async refreshAnswerData() {
            // 重置状态
            this.allData = [];
            this.noMore = false;
            this.currentPageNum = 1;
            this.findTop = false;
            this.isLoading = false;
            
            // 重新获取数据
            await this.formAnswers();
        }
    },
    created() {
        this.qid = Number(localStorage.getItem('id'))
        this.topAid = Number(localStorage.getItem('topAid'))
        this.toupdate_answer_questionTitle = localStorage.getItem('questionTitle') || ''
        this.findTop = false;
        this.formAnswers()
    },
}
</script>

<style scoped>
.forum__bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>