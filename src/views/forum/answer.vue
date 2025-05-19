<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
            <AppHeader />
        </v-app-bar>
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: 1100px; margin-top: 150px;"
            @scroll.passive="handleScroll"
        >
            <QuestionCard
                :id="this.qid"
                :title="this.qtitle"
                :content="this.qcontent"
                :answer-count="this.qanswerCount"
                :reward="this.qreward"
                :isAnswer="true"
            />
            <ContentCard 
                v-for="(item, index) in paginatedData" 
                :key="index"
                :uid="item.userId"
                :content="item.content"
                :paraList="[item.likeCount, 0, item.commentCount, 0, 0]"
                :noTitle="true"
            />
            <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="primary"
            />
            <v-card-text
                v-if="noMore"
                class="text-center text-caption pa-2"
            >
                没有更多了...
            </v-card-text>

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
import AppHeader from '../../components/nav/ForumHeadBar.vue'
import ContentCard from '../../components/forum/ContentCard.vue';
import QuestionCard from '../../components/forum/QuestionCard.vue'
import Mock from 'mockjs'

export default {
    components: { AppHeader, ContentCard, QuestionCard },
    data() {
        return {
            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 4,
            totalItem: 0,
            allData: [],
            
            qid: "",
            qanswerCount: 0,
            qreward: 0,
            qtitle: "",
            qcontent: "",
        }
    },
    computed: {
        paginatedData() {
            const end = this.currentPageNum * this.itemsPerPage
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
        initQuestion() {
            this.qid = localStorage.getItem('forum_qid')
            this.qanswerCount = localStorage.getItem('forum_answerCount')
            this.qreward = localStorage.getItem('forum_reward')
            this.qtitle = localStorage.getItem('forum_title')
            this.qcontent = localStorage.getItem('forum_content')
        },
        async fetchData() {
            if (this.noMore) {
                return
            }
            try {
                // const response = await axios.get(`/api/questions?page=${this.currentPage}&limit=${this.itemsPerPage}`)
                this.isLoading = true
                const response = [200, {
                    state: "SUCCESS",
                    code: "1",
                    msg: Mock.mock({
                    [`list|${this.itemsPerPage}`]: [{
                        'id|+1': this.currentPageNum * this.itemsPerPage + 1,
                        questionId: '@guid()',
                        userId: '@ctitle(3,6)',
                        content: '@cparagraph(1,3)',
                        createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
                        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
                        'isDeleted|1': [true, false],
                        'likeCount|0-1000': 1,
                        'commentCount|0-50': 1
                    }]
                    }).list
                }];
                let data = response[1].msg

                if (data.length < this.itemsPerPage) {
                    this.noMore = true
                }

                this.allData = [...this.allData, ...data]

                this.currentPageNum += 1
                this.isLoading = false
            } catch (error) {
                console.error('请求失败:', error)
            }
        }
    },
    created() {
        this.initQuestion()
        this.fetchData()
    }
}
</script>