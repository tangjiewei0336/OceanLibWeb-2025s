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
                <span v-if="replyTo.length > 0">
                    <v-icon>mdi-chevron-right</v-icon>
                    {{ replyTo }}
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
                        <v-icon left small>{{ inner_liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                        {{ inner_likeCount }}
                    </v-btn>
                    <v-btn :ripple="false" x-small text @click="dislikeComment">
                        <v-icon left small>{{ inner_disliked ? 'mdi-heart-off' : 'mdi-heart-off-outline' }}</v-icon>
                    </v-btn>
                </div>
            </div>

            <CommentCard
                v-for="(item, index) in SubData"
                :key="index"
                :id="item.id"
                :cid="cid"
                :aid="aid"
                :uid="uid"
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
            inner_liked: false,
            inner_disliked: false,

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
            required: false
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
        liked: {
            type: Boolean,
            default: false
        },
        disliked: {
            type: Boolean,
            default: false
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
                // 尝试创建Date对象（会自动处理多种格式）
                const d = new Date(date);
                // 检查是否为无效日期（NaN）
                if (isNaN(d.getTime())) throw new Error("Invalid date");
                // 有效日期则格式化
                return d.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            } catch (e) {
                // 任何解析失败时返回原字符串
                return String(date);
            }
			// return new Date(date).toLocaleDateString('zh-CN', {
			// 	year: 'numeric',
			// 	month: '2-digit',
			// 	day: '2-digit'
			// })
		},
        likeComment() {
            if (this.inner_liked) {
                this.inner_likeCount -= 1
                this.inner_liked = false
            } else {
                this.inner_likeCount += 1
                this.inner_liked = true
                this.inner_disliked = false
            }
        },
        dislikeComment() {
            if (this.inner_disliked) {
                this.inner_disliked = false
            } else {
                this.inner_disliked = true
                if (this.inner_liked) {
                    this.inner_likeCount -= 1
                    this.inner_liked = false
                }
            }
        },
        reply() {
            this.commentWriteOpen = true
        },
        allReply() {
            this.$emit('allreply', this.cid);
            localStorage.setItem('replyCount', this.replyCount)
            localStorage.setItem('replyContent', this.content)
            localStorage.setItem('replyDate', this.date)
            localStorage.setItem('replyLikeCount', this.likeCount)
            localStorage.setItem('replyUid', this.uid)
        },
        finishComment() {
            this.commentWriteOpen = false
        }
    },
    created() {
        this.inner_likeCount = this.likeCount
        this.inner_liked = this.liked
        this.inner_disliked = this.disliked
    }
}
</script>