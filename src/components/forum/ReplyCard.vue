<template>
    <v-card flat>
        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto pa-0"
            fluid
            style="height: 600px;"
            @scroll.passive="handleScroll"
        >
            <CommentCard
                :id="cid"
                :cid="cid"
                :uid="uid"
                :aid="aid"
                :content="replyContent"
                :date="replyDate"
                :likeCount="replyLikeCount"
                interface="outer"
                @refresh="refresh"
            />
            <v-sheet
                color="grey lighten-2" 
                height="5px"
                width="100%"
                rounded="0"
            />
            <div>
                <v-card-text class="pa-1" style="margin-left: 10px;">
                    评论 {{ replyCount }}
                </v-card-text>
            </div>
            <CommentCard
                v-for="(item, index) in paginatedData" 
                :key="index"
                :id="item.id"
                :cid="cid"
                :aid="aid"
                :uid="item.replyBuildUsername"
                :content="item.commentContent"
                :date="item.buildDate"
                :likeCount="item.likeNumber"
                :replyTo="item.replyToCommentReplier"
                interface="inner"
                @refresh="refresh"
            />
        </v-container>
    </v-card>
</template>

<script>
import Mock from 'mockjs'
import CommentCard from './CommentCard.vue'

export default {
    name: "ReplyCard",
    components: { CommentCard },
    data() {
        return {
            isLoading: false,
            noMore: false,
            currentPageNum: 1,
            itemsPerPage: 6,
            allData: [],

            uid: '',
            replyCount: 0,
            replyContent: "",
            replyDate: '',
            replyLikeCount: 0
        }
    },
    props: {
        aid: {
            type: Number,
            required: true
        },
        cid: {
            type: String,
            required: true
        },
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
                url: '/comment/getCommentReply',
                params: {
                    bindID: this.aid,
                    mainType: "ANSWER",
                    commentID: this.cid,
                    pageNum: this.currentPageNum,
                    replyCount: this.itemsPerPage,
                },
            }).then(response => {
                let data = response.data.msg.replyCommentList
                console.log(response.data.msg.replyCommentList)
                this.allData = [...this.allData, ...data]
                if (this.allData.length >= this.replyCount) {
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
        reply() {
            console.log('reply')
        },
        formatDate(date) {
			return new Date(date).toLocaleDateString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
		},
        likeComment() {
            this.liked = !this.liked;
            this.likeCount += this.liked ? 1 : -1;
            this.disliked = false;
        },
        dislikeComment() {
            this.disliked = !this.disliked;
            if (this.disliked) {
                this.likeCount -= 1;
                this.liked = false;
            }
        },
        refresh() {
            this.currentPageNum = 1;
            this.noMore = false;
            this.allData = [];
        }
    },
    created() {
        this.fetchData()
        this.replyCount = Number(localStorage.getItem('replyCount'))
        this.replyContent = localStorage.getItem('replyContent')
        this.replyDate = localStorage.getItem('replyDate')
        this.replyLikeCount = Number(localStorage.getItem('replyLikeCount'))
        this.uid = localStorage.getItem('replyUid')
    }
}
</script>