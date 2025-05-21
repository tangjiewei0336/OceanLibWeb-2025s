<template>
	<v-card
		class="pa-4"
		flat
		:ripple="false"
		@click="toQuestion"
	>
		<div 
			class="d-flex"
			v-if="this.interface === 'hot'"
		>
			<v-chip
				:color="getColor(seqId + 1)"
				small
				class="mr-2"
			>
				{{ seqId + 1 }}
			</v-chip>

			<div class="text-h7 font-weight-bold">
				{{ qtitle }}
				<div class="d-flex mt-3">
					<div class="mr-4 text-caption grey--text">
						<span>热度: {{ hotFormat(hotPoint) }}</span>
					</div>
				</div>

			</div>
		</div>

		<div v-if="this.interface === 'question' || this.interface === 'answer'">
			<v-card-title class="pt-0 font-weight-bold">{{ qtitle }}</v-card-title>

			<v-card-text v-if="this.interface === 'question'">
				<div v-if="!expanded" @click="expanded = true" >
					{{ truncateContent(qcontent) }}
					<span class="grey--text text--lighten-1 text-caption">展开...</span>
				</div>
				<div v-if="expanded">
					{{ qcontent }}
					<div>
						<v-btn 
							@click="expanded = false" 
							text
							small
							color="grey"
						>
							收起
							<v-icon right small>
								{{ 'mdi-chevron-up' }}
							</v-icon>
						</v-btn>
					</div>
				</div>
			</v-card-text>

			<div style="margin-left: 20px;" class="text-caption ml-4">
				<span v-if="this.interface === 'answer'">知乎 · </span>
				<span class="font-weight-bold">{{ commentNum }}</span> 评论
				<span v-if="this.interface === 'question'">
					 · <span class="font-weight-bold">{{ browse }}</span> 浏览
				</span>
			</div>
		</div>

		<div v-if="this.interface === 'answerWrite'">
			<v-card-title class="pt-0 font-weight-bold">{{ qtitle }}</v-card-title>
		</div>
	</v-card>
</template>
  
<script>
import Mock from 'mockjs'
export default {
	name: 'QuestionCard',
	data() {
        return {
			hotPoint: 0,
			qtitle: "",
			qcontent: "",
			expanded: false,
			browse: 0,
			commentNum: 0,
        }
    },
	props: {
		qid: {
			type: Number,
			required: true
		},
		interface: {
			type: String,
			required: true
		},
		seqId: {
			type: Number,
			default: 0
		},
	},
	methods: {
		hotFormat() {
			if (this.hotPoint < 10000) {
				return this.hotPoint.toString()
			} else {
				return (this.hotPoint / 10000).toFixed(1) + '万'
			}
		},
		fetchData() {
			try {
				// get info (qid)
                // const response = await axios.get(`/api/questions?page=${this.currentPage}&limit=${this.itemsPerPage}`)
                const response = [200, {
                    state: "SUCCESS",
                    code: "1",
                    msg: Mock.mock({
						'title': '@ctitle(10,20)',
						'hotPoint|5000-3000000': 1,
						content: '@ctitle(50,100)',
						'commentNum|10-100': 1,
						'browse|20-300': 1,
						'likeCount|10-50': 1,
						'liked|1': [true, false],
					})
                }]
                this.qtitle = response[1].msg.title
				this.hotPoint = response[1].msg.hotPoint
				this.qcontent = response[1].msg.content
				this.commentNum = response[1].msg.commentNum
				this.browse = response[1].msg.browse

				this.likeCount = response[1].msg.likeCount
				this.liked = response[1].msg.liked

				localStorage.setItem('qlikeCount', this.likeCount)
				localStorage.setItem('qliked', this.liked)

				localStorage.setItem('qtitle', this.qtitle)

            } catch (error) {
                console.error('请求失败:', error)
            }
		},
		getColor(num) {
			const colorMap = {
				1: 'red',
				2: 'orange',
				3: 'yellow'
			}
			return colorMap[num] || 'transparent'
		},
		toQuestion() {
			if (this.interface == 'hot' || this.interface == 'answer') {
				localStorage.setItem('qid', this.qid)
				this.$router.push('./question')
			}
		},
		truncateContent(text, length = 34) {
			return text.length > length 
			? text.substring(0, length)
			: text
		},
	},
	created() {
        this.fetchData()
    }
}
</script>