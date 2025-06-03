<template>
    <v-card class="d-flex align-start pa-4" flat>
        <v-avatar v-if="this.interface==='outer'" size="30" color="primary" class="mr-3">
            <span class="white--text">{{ uid.charAt(0) }}</span>
        </v-avatar>
        <v-avatar v-if="this.interface==='inner'" size="25" color="primary" class="mr-3">
            <span class="white--text">{{ uid.charAt(0) }}</span>
        </v-avatar>
        <div>
            <div>
                <span>{{ uid }}</span>
                <span v-if="inner_replyTo.length > 0">
                    <v-icon>mdi-chevron-right</v-icon>
                    {{ inner_replyTo }}
                </span>
            </div>
            <div>
                <span class="text--lighten-1 text-caption" @click="reply">{{ content }}</span>
            </div>
            <div class="d-flex align-center">
                <span class="grey--text text--lighten-1 text-caption">
                    {{ formatDate(date) }}
                </span>
                <v-btn :ripple="false" small text class="pa-0" @click="reply">
                    回复
                </v-btn>
                <v-spacer></v-spacer>
                <div>
                    <v-btn :ripple="false" x-small text @click="likeComment">
                        <v-icon left small>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                        {{ inner_likeCount }}
                    </v-btn>
                    <v-btn :ripple="false" x-small text @click="dislikeComment">
                        <v-icon left small>{{ disliked ? 'mdi-heart-off' : 'mdi-heart-off-outline' }}</v-icon>
                    </v-btn>
                </div>
            </div>

            <CommentCard
                v-for="(item, index) in subComments"
                :key="index"
                :id="item.id"
                :cid="cid"
                :uid="uid"
                :rid="item.id"
                :aid="aid"
                :content="item.commentContent"
                :date="item.buildDate"
                :likeCount="item.likeNumber"
                :disliked="Boolean(item.dislikeNumber)"
                :replyTo="item.replyToCommentReplier"
                interface="inner"
            />
            <div v-if="replyCount > 2" class="d-flex align-center">
                <v-btn
                    small
                    :ripple="false"
                    @click="allReply"
                    class="rounded-pill"
                    depressed
                >
                    查看更多 {{ replyCount - 2 }} 条回复 >
                </v-btn>
            </div>
        </div>
        <v-bottom-sheet
            v-model="commentWriteOpen"
            inset
        >
            <CommentWrite
                :uid="uid"
                :aid="aid"
                :interface="getInterface"
                :cid="cid"
                :rid="id"
                :isReply="getIsReply"
                @close="finishComment"
            />
        </v-bottom-sheet>
    </v-card>
</template>

<script>
import CommentWrite from './CommentWrite.vue'

export default {
    name: "CommentCard",
    components: { CommentWrite },
    data() {
        return {
            inner_likeCount: 0,
            inner_replyTo: '',
            liked: false,
            disliked: false,

            commentWriteOpen: false
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        cid: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        rid: {
            type: String,
            required: false,
            default: ''
        },
        aid: {
            type: Number,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        likeCount: {
            type: Number,
            default: 0
        },
        subComments: {
            type: Array,
            default: () => []
        },
        replyCount: {
            type: Number,
            default: 0
        },
        replyTo: {
            type: String,
            default: ''
        },
        interface: {
            type: String,
            required: true
        }
    },
    computed: {
        SubData() {
            const end = Math.min(this.subComments.length, 2);
            return this.subComments.slice(0, end)
        },
        getIsReply() {
            if (this.interface == "outer") {
                return false;
            } else {
                return true;
            }
        },
        getInterface() {
            if (this.interface == "outer") {
                return "level2";
            } else {
                return "level3";
            }
        }
    },
    methods: {
        formatDate(date) {
            try {
                const d = new Date(date);
                if (isNaN(d.getTime())) throw new Error("Invalid date");
                return d.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            } catch (e) {
                return String(date);
            }
		},
        likeComment() {
            this.$Axios({
                method: 'post',
                url: '/comment/evaluateComment',
                params: {
                    bindID: this.aid,
                    mainType: "ANSWER",
                    commentID: this.cid,
                    isCancel: this.liked,
                    isLike: true
				},
            }).then(response => {
				console.log(response)
            }).catch(error => {
                console.error('评论失败:', error)
            })
            if (this.liked) {
                this.inner_likeCount -= 1
                this.liked = false
            } else {
                this.inner_likeCount += 1
                this.liked = true
                this.disliked = false
            }
        },
        dislikeComment() {
            this.$Axios({
                method: 'post',
                url: '/comment/evaluateComment',
                params: {
                    bindID: this.aid,
                    mainType: "ANSWER",
                    commentID: this.cid,
                    isCancel: this.disliked,
                    isLike: false
				},
            }).then(response => {
				console.log(response)
            }).catch(error => {
                console.error('评论失败:', error)
            })
            
            if (this.disliked) {
                this.disliked = false
            } else {
                this.disliked = true
                if (this.liked) {
                    this.inner_likeCount -= 1
                    this.liked = false
                }
            }
        },
        reply() {
            this.commentWriteOpen = true
        },
        allReply() {
            localStorage.setItem('replyCount', this.replyCount)
            localStorage.setItem('replyContent', this.content)
            localStorage.setItem('replyDate', this.date)
            localStorage.setItem('replyLikeCount', this.likeCount)
            localStorage.setItem('replyUid', this.uid)
            this.$emit('allreply', this.cid);
        },
        finishComment() {
            this.commentWriteOpen = false
            this.$emit('refresh');
        }
    },
    created() {
        this.inner_likeCount = this.likeCount
        if (this.replyTo == null) {
            this.inner_replyTo = ""
        } else {
            this.inner_replyTo = this.replyTo
        }
    }
}
</script>