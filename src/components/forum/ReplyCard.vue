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
                :cid="cid"
                :uid="uid"
                :content="content"
                :date="date"
                :likeCount="likeCount"
                :liked="liked"
                :disliked="disliked"
                interface="outer"
            />
            <v-sheet
                color="grey lighten-2" 
                height="5px"
                width="100%"
                rounded="0"
            />
            <div>
                <v-card-text class="pa-1" style="margin-left: 10px;">
                    评论 {{ commentCount }}
                </v-card-text>
            </div>
            <CommentCard
                v-for="(item, index) in subComments" 
                :key="index"
                :cid="item.cid"
                :uid="item.uid"
                :content="item.content"
                :date="item.date"
                :likeCount="item.likeCount"
                :liked="item.liked"
                :disliked="item.disliked"
                interface="inner"
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
            uid: "",
            content: "",
            date: "",
            likeCount: 0,
            liked: false,
            disliked: false,
            commentCount: 0,

            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 6,
            subComments: []
        }
    },
    props: {
        cid: {
            type: Number,
            required: true
        },
    },
    computed: {
        SubData() {
            const end = this.subComments.length;
            return this.subComments.slice(0, end)
        }
    },
    methods: {
        async fetchBasicData() {
            const response = await axios({
                method: 'get',
                url: '/comment/getComment',
                params: {
                    bindID: this.cid,
                    mainType: 'answer',
                    commentCount: this.itemsPerPage,
                    replyCount: 2,
                    pageNum: this.currentPageNum,
                },
            });

            // 获取指定回复
            // const data = Mock.mock({
            //     'cid|+1': 1,
            //     'uid': '@ctitle(3,8)',
            //     'content': '@ctitle(50,100)',
            //     'date': '@datetime',
            //     'likeCount|1-100': 1,
            //     'liked|1': [true, false],
            //     'disliked|1': [true, false],
            //     'commentCount|1-100': 1
            // });

            this.uid = data.uid;
            this.content = data.content;
            this.date = data.date;
            this.likeCount = data.likeCount;
            this.liked = data.liked;
            this.disliked = data.disliked;
            this.commentCount = data.commentCount;

        },
        fetchSubComments() {
            if (this.noMore) {
                return
            }
            try {
                // 获取指定回复的子回复
                this.isLoading = true
                const data = Mock.mock({
                    'subComments|6': [
                        {
                            'cid|+1': 1,
                            'uid': '@ctitle(3,8)',
                            'content': '@ctitle(50,100)',
                            'date': '@datetime',
                            'likeCount|1-100': 1,
                            'liked|1': true,
                            'disliked|1': true
                        }
                    ]
                });

                this.subComments = [...this.subComments, ...data.subComments]
                if (data.subComments.length < this.itemsPerPage) {
                    this.noMore = true
                }
                this.currentPageNum += 1
                this.isLoading = false
            } catch (error) {
                console.error('请求失败:', error)
            }
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
        handleScroll() {
            const container = this.$refs.scrollContainer;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                this.fetchSubComments();
            }
        },
    },
    created() {
        this.fetchBasicData();
        this.fetchSubComments();
    }
}
</script>