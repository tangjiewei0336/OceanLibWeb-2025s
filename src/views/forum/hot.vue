<template>
    <div class="forum">
        <!-- <v-app-bar app fixed color="white" elevation="1" height="64">
        </v-app-bar> -->
        <AppHeader/>
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: calc(100vh - 220px);"
            @touchstart.passive="handleTouchStart"
            @touchmove.passive="handleTouchMove"
            @touchend.passive="handleTouchEnd"
            @scroll.passive="handleScroll"
        >
            <div 
                v-show="pullDownState"
                class="pull-refresh-hint"
                :style="{ height: `${pullDownHeight}px` }"
            >
                <div class="d-flex align-center justify-center">
                    <template v-if="pullDownState === 'pulling'">
                        <p class="blue--text">下拉刷新↓</p>
                    </template>
                    
                    <template v-else-if="pullDownState === 'ready'">
                        <p class="blue--text">松开刷新↑</p>
                    </template>
                </div>
            </div>
            <QuestionCard 
                v-for="(item, index) in paginatedData" 
                :key="index"
                :seqId="index"
                :qid="item.bindId"
                interface="hot"
                :qtitle="item.title"
                :hotPoint="item.viewCount"
                :qcontent="item.content"
                :commentNum="item.answerCount"
                :browse="item.viewCount"
                :likeCount="item.likeCount"
                :qliked="item.isLiked"
            />
            <v-row justify="center" align="center">
                <v-col cols="auto">
                    <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
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
            <v-btn value="forum" to="/forum/hot">
                <span>知乎</span>
                <v-icon>mdi-forum</v-icon>
            </v-btn>
            <v-btn value="mine" to="/mine">
                <span>我的</span>
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
  </template>

<script>
import AppHeader from '../../components/nav/ForumHeadBar.vue'
import QuestionCard from '../../components/forum/QuestionCard.vue';
import axios from 'axios'
import Mock from 'mockjs'

export default {
    components: { AppHeader, QuestionCard },
    data() {
        return {
            navigation: 3,
            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 10,
            allData: [],

            startY: 0,          // 触摸起始位置
            pullDownState: '',  // '' | 'pulling' | 'ready' | 'loading'
            pullDownHeight: 0   // 下拉距离
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
                url: '/qaService/question/list',
                params: {
                    page: this.currentPageNum + 1,
                    pageSize: this.itemsPerPage,
                    sort: 1,
                    includeDeleted: 0
                },
            }).then(response => {
                let data = response.data.msg.content
                // console.log('hot question: ', data)
                this.allData = [...this.allData, ...data]
                if (response.data.msg.last) {
                    this.noMore = true
                } else {
                    this.currentPageNum += 1
                }
                this.isLoading = false
            }).catch(error => {
                console.error('请求失败:', error)
                this.isLoading = false
            })
        },

        handleTouchStart(e) {
            if (this.$refs.scrollContainer.scrollTop === 0) {
                this.startY = e.touches[0].clientY
            }
        },
        handleTouchMove(e) {
            if (this.startY === 0) return
            const y = e.touches[0].clientY
            const diff = y - this.startY
            if (diff > 0 && this.$refs.scrollContainer.scrollTop <= 0) {
                this.pullDownHeight = Math.min(diff, 100)
                this.pullDownState = diff > 60 ? 'ready' : 'pulling'
            }
        },
        handleTouchEnd() {
            if (this.pullDownState === 'ready') {
                this.pullDownState = 'loading'
                this.onRefresh()
            } else {
                this.resetPull()
            }
        },
        resetPull() {
            this.pullDownHeight = 0
            this.pullDownState = ''
            this.startY = 0
        },
        async onRefresh() {
            this.currentPageNum = 0,
            this.itemsPerPage = 10,
            this.allData = []
            this.noMore = false
            this.isLoading = false
            this.fetchData()
            this.pullDownState = ''
        },
    },
    created() {
        // let refresh = localStorage.getItem('refresh')
        // if (refresh == 'true') {
        //     localStorage.setItem('refresh', 'false')
        //     this.$router.go(0)
        // } else {
        //     localStorage.setItem('refresh', 'true')
        // }
        this.fetchData()
    }
}
</script>