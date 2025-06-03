<template>
    <div class="question">
        <ReturnHeader
            interface="question"
        />
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: 550px"
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
				width="92%"
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
            />

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
                    @click="writeAnswerButton"
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

        <v-bottom-navigation 
            shift 
            color="primary" 
            grow 
            fixed
            v-model="navigation"
        >
            <v-btn value="library" to="/index">
                <span>文库</span>
                <v-icon>mdi-text-box-search</v-icon>
            </v-btn>
            <v-btn value="help" to="/wall">
                <span>互助</span>
                <v-icon>mdi-handshake</v-icon>
            </v-btn>
            <v-btn value="mine" to="/mine">
                <span>我的</span>
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
            <v-btn value="forum" to="/forum/hot">
                <span>知乎</span>
                <v-icon>mdi-forum</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
  </template>

<script>
import QuestionCard from '../../components/forum/QuestionCard.vue';
import ReturnHeader from '../../components/nav/ReturnHeader.vue';
import ContentCard from '../../components/forum/ContentCard.vue';
import Mock from 'mockjs'

export default {
    components: { QuestionCard, ReturnHeader, ContentCard },
    data() {
        return {
            navigation: 3,
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
            this.$Axios({
                method: 'get',
                url: '/qaService/answer/list',
                params: {
                    questionId: this.qid,
                    page: this.currentPageNum + 1,
                    pageSize: this.itemsPerPage,
                },
            }).then(response => {
                let data = response.data.msg.content
                console.log("answers: ", data)
                this.allData = [...this.allData, ...data]
                if (this.allData.length >= this.commentNum) {
                    this.noMore = true
                } else {
                    this.currentPageNum += 1
                }
                this.isLoading = false
            }).catch(error => {
                this.isLoading = false
                console.error('请求失败:', error)
            })
        },
        writeAnswerButton() {
            localStorage.setItem('qid', this.qid)
            this.$router.push('./answerWrite')
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
        }
    },
    created() {
        this.qid = Number(localStorage.getItem('qid'))
        this.qtitle = String(localStorage.getItem('qtitle'))
        this.hotPoint = Number(localStorage.getItem('hotPoint'))
        this.qcontent = String(localStorage.getItem('qcontent'))
        this.commentNum = Number(localStorage.getItem('commentNum'))
        this.browse = Number(localStorage.getItem('browse'))
        this.qlikeCount = Number(localStorage.getItem('likeCount'))
        this.qliked = Boolean(localStorage.getItem('qliked') == 'true')

        this.fetchData()
    },
}
</script>