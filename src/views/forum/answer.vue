<template>
    <div>
        <ReturnHeader
            interface="answer"
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
                interface="answer"
                :qtitle="qtitle"
                :hotPoint="hotPoint"
                :qcontent="qcontent"
                :commentNum="commentNum"
                :browse="browse"
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
                :rid="item.id"
                interface="answer"
            />
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
            navigation: '',
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
            if (this.noMore) {
                return
            }
            try {
                this.isLoading = true
                // const response = [200, {
                //     state: "SUCCESS",
                //     code: "1",
                //     msg: {
                //         pageNum: this.currentPageNum,
                //         pageSize: this.itemsPerPage,
                //         total: 100,
                //         isLastPage: false,
                //         list: Mock.mock({
                //             [`list|${this.itemsPerPage}`]: [{
                //             'id|+1': (this.currentPageNum - 1) * this.itemsPerPage + 1,
                //             title: '@ctitle(10,20)',
                //             content: '@ctitle(100,500)',
                //             'answerCount|0-100': 1,
                //             'rewardPoints|0-50': 1,
                //             createTime: '@datetime'
                //             }]
                //         }).list
                //     }
                // }]

                this.$Axios({
                    method: 'get',
                    url: '/qaService/answer/list',
                    params: {
                        questionId: this.qid,
                        page: this.currentPageNum + 1,
                        pageSize: this.itemsPerPage,
                    },
                }).then(response => {
                    let data = response[1].msg
                    this.allData = [...this.allData, ...data]
                    if (data.length < this.itemsPerPage) {
                        this.noMore = true
                    }
                    if (data.length > 0) {
                        this.currentPageNum += 1
                    }
                    this.isLoading = false
                }).catch(error => {
                    console.error('请求失败:', error)
                })

                const response = await axios({
                    method: 'get',
                    url: '/list',
                    params: {
                        questionId: this.qid,
                        page: this.currentPageNum,
                        pageSize: this.itemsPerPage,
                    },
                });
                

                let data = response[1].msg
                this.allData = [...this.allData, ...data.question]
                if (data.list.length < this.itemsPerPage) {
                    this.noMore = true
                }
                if (data.list.length > 0) {
                    this.currentPageNum += 1
                }
                this.isLoading = false
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
    },
    created() {
        this.qid = Number(localStorage.getItem('qid'))

        this.qtitle = String(localStorage.getItem('qtitle'))
        this.hotPoint = Number(localStorage.getItem('hotPoint'))
        this.qcontent = String(localStorage.getItem('qcontent'))
        this.commentNum = Number(localStorage.getItem('commentNum'))
        this.browse = Number(localStorage.getItem('browse'))
        
        this.fetchData()
    },
    mounted() {
        // this.qlikeCount = Number(localStorage.getItem('qlikeCount'))
        // this.qliked = Number(localStorage.getItem('qliked'))
    }
}
</script>