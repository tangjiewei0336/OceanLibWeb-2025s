<template>
    <div>
        <ReturnHeader
            interface="answer"
        />
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: calc(100vh - 100px);"
            @scroll.passive="handleScroll"
        >
            <QuestionCard
                :id="this.qid"
                interface="answer"
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
            currentPageNum: 1,
            leastNum: 6,
            itemsPerPage: 4,
            allData: [],

            topAid: 0,
            findTop: false,
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
                this.fetchData();
            }
        },
        async fetchData() {
            if (this.noMore || this.isLoading) {
                return
            }
            this.isLoading = true
            while (!this.findTop || this.allData.length < this.leastNum) {
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
                    
                    let data = response.data.msg.content
                    // console.log("answers: ", data)
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
                    if ((this.currentPageNum * this.itemsPerPage) >= this.commentNum) {
                        this.noMore = true;
                        break;
                    } else {
                        this.currentPageNum += 1;
                    }
                } catch(error) {
                    console.error('请求失败:', error)
                } finally {
                    if (this.findTop && this.allData.length < this.leastNum) {
                        this.isLoading = false;
                    }
                }
            }
            
        },
        parseData(resData) {
            try {
                this.allData = JSON.parse(resData);
            } catch (e) {
                console.error('解析失败:', e);
                this.allDat = [];
            }
        }
    },
    created() {
        this.qid = Number(localStorage.getItem('qid'))
        this.qtitle = String(localStorage.getItem('qtitle'))
        this.hotPoint = Number(localStorage.getItem('hotPoint'))
        this.qcontent = String(localStorage.getItem('qcontent'))
        this.commentNum = Number(localStorage.getItem('commentNum'))
        this.browse = Number(localStorage.getItem('browse'))

        this.topAid = Number(localStorage.getItem('topAid'))
        this.findTop = false;
        this.fetchData()
    },
}
</script>