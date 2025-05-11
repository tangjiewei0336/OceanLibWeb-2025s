<template>
    <v-card class="ask-card">
        <v-app-bar dense flat>
            <v-btn icon @click="$emit('close')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <span class="headline">提问</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="submitQuestion" :disabled="!questionTitle.endsWith('?')">
                发布
            </v-btn>
        </v-app-bar>

        <v-card-text>
            <v-text-field
                placeholder="输入问题并以问号结尾（必填）"
                v-model="questionTitle"
                outlined
                dense
            />
            <v-textarea
                placeholder="详细说明问题，快速获得专业解答（选填）"
                v-model="questionDescription"
                auto-grow
                outlined
                dense
            />
        </v-card-text>

        <v-bottom-navigation grow>
            <v-btn icon>
                <v-icon>mdi-pound</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-at</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-image</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-card>
</template>

<script>
export default {
    name: 'AskCard',
    data() {
        return {
            questionTitle: '',
            questionDescription: ''
        };
    },
    methods: {
        submitQuestion() {
            console.log('问题标题:', this.questionTitle);
            console.log('问题描述:', this.questionDescription);
            if (this.questionTitle.endsWith('?')) {
                this.$emit('close');
            } else {
                alert('问题必须以问号结尾！');
            }
        }
    }
};
</script>

<style scoped>
.ask-card {
    max-width: 600px;
}
</style>
