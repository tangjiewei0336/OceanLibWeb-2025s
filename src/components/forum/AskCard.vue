<template>
  <div class="ask-card">
    <!-- 顶部导航栏 -->
    <div class="ask-card-toolbar">
      <v-btn icon @click="onCloseClick" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span class="ask-card-title">
        <!-- 根据 questionId 动态显示“编辑问题”或“提问” -->
        {{ questionId ? '编辑问题' : '提问' }}
      </span>
      <v-btn
        color="primary"
        @click="publish"
        class="publish-btn"
        :disabled="!title.trim()"
      >
        发布
      </v-btn>
    </div>

    <!-- 标题输入 -->
    <input
      v-model="title"
      class="title-input"
      placeholder="输入问题标题，并以问号结尾（必填）"
      @blur="checkTitle"
      @input="onTitleInput"
      ref="titleInput"
    />

    <!-- 分割线 -->
    <hr class="divider" />

    <div class="editorarea">
      <div style="border: 1px solid #ccc; margin-top: 10px">
        <!-- 工具栏 -->
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
        />
        <!-- 编辑器 -->
        <Editor
          style="height: 600px; overflow-y: hidden"
          :defaultConfig="editorConfig"
          v-model="html"
          @onChange="onChange"
          @onCreated="onCreated"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { baseURL } from '../../config.js';

export default {
  name: 'AskCard',

  props: {
    questionId: {
      type: [String, Number],
      default: null
    },
    // 如果有用到初始标题和内容，也可以通过 props 传入
    initialTitle: {
      type: String,
      default: ''
    },
    initialContent: {
      type: String,
      default: ''
    }
  },

  emits: ['close'],

  components: { Editor, Toolbar },

  data() {
    const vm = this;
    return {
      title: vm.initialTitle,
      html: vm.initialContent,
      editor: null,

      toolbarConfig: {
        excludeKeys: [
          "insertVideo", "group-video", "uploadVideo", "video"
        ]
      },
      editorConfig: {
        placeholder: "详细说明问题，以获取专业解答（选填）",
        MENU_CONF: {
          // 图片上传配置
          uploadImage: {
            // 用 function 而不是箭头，这样 this 指向组件实例
            async customUpload(file, insertFn) {
              // 这里的 this 就是当前组件实例
              console.log("customUpload 里 this:", vm);
              const url = await vm.uploadImageAPI(file);
              if (url) {
                insertFn(url, '', '');
              } else {
                console.error('图片上传失败');
              }
            },
            allowedFileTypes: ['image/*']
          }
        }
      }
    };
  },

  watch: {
    // 监听 questionId 的变化
    questionId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          // 如果传入了新的 questionId，就去拉对应的题目详情
          this.fetchQuestionDetail(newId);
        } else {
          // 如果 questionId 变为 null 或 undefined，则清空标题和内容，回到“提问”模式
          this.title = '';
          this.html = '';
        }
      }
    }
  },

  methods: {
    async uploadImageAPI(file) {
      if (!file) {
        this.$toast.fail('请选择要上传的图片');
        return null;
      }

      const maxSize = 10 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        this.$toast.fail('图片不能超过10MB');
        return null;
      }

      if (!file.type.startsWith('image/')) {
        this.$toast.fail('只允许上传图片');
        return null;
      }

      const formData = new FormData();
      formData.append('uploadFile', file);

      try {
        const response = await this.$Axios.post('/qaService/qaFile/uploadFile',
          formData,
        );

        if (response.data.state === 'SUCCESS') {
          const { fileName, fileSuffix } = response.data.msg;
          const url = baseURL + `/qaService/qaFile/downloadFile/${fileName}${fileSuffix}`;
          this.$toast.success('图片上传成功');
          return url;
        } else {
          this.$toast.fail(response.data.msg || '图片上传失败');
          return null;
        }
      } catch (err) {
        console.error(err);
        this.$toast.fail('上传图片失败');
        return null;
      }
    },

    async fetchQuestionDetail(id) {
      try {
        const resp = await this.$Axios.get('/qaService/question/details', {
          params: { questionId: id }
        });
        const data = resp.data;
        if (data.state === "SUCCESS") {
          // 拉回来的 title、content 填到 data 里
          this.title = data.msg.title;
          this.html = data.msg.content;
          // 如果你需要把编辑器移动到最后，也可以在这里做： 
          // this.$nextTick(() => { this.editor?.chain().focus().selectAll().delete(); /* 视情况而定 */ });
        } else {
          this.$toast.fail(data.msg || '获取问题详情失败');
        }
      } catch (err) {
        console.error('拉取详情异常', err);
        this.$toast.fail('获取问题详情失败');
      }
    },

    onCloseClick() {
      // 如果标题和正文都为空，或者是编辑模式直接关闭，不弹草稿提示
      if ((!this.title.trim() && !this.html.trim()) || this.questionId) {
        this.$emit('close', { shouldRefresh: false });
        return;
      }
      // 否则弹出“保存草稿”确认框
      this.$dialog.confirm({
        title: '是否保存草稿？',
        message: '你还没有发布，是否保存为草稿？'
      })
      .then(() => {
        this.publishDraft();
      })
      .catch(() => {
        this.$emit('close', { shouldRefresh: false });
      });
    },

    // 保存草稿
    publishDraft() {
      const content = this.editor?.getHtml() || '';
      this.$Axios({
        method: 'PUT',
        url: '/qaService/question/new',
        params: {
          title: this.title,
          content: content,
        }
      })
      .then(() => {
        this.$toast.success('草稿已保存');
        this.$emit('close', { shouldRefresh: false });
      })
      .catch(() => {
        this.$toast.fail('保存失败');
      });
    },

    checkTitle() {
      if (
        this.title &&
        !this.title.trim().endsWith('？') &&
        !this.title.trim().endsWith('?')
      ) {
        this.title = this.title.trim() + '？';
      }
    },

    onTitleInput() {
      if (this.title.trim().endsWith('?')) {
        setTimeout(() => {
          this.editor?.chain().focus().run();
        }, 100);
      }
    },

    onCreated(editor) {
      // wangeditor 创建完成后的回调，把实例挂到 this.editor
      this.editor = Object.seal(editor);
    },

    onChange(editor) {
      // 这里可以随时取 editor.getHtml() / editor.getText()
    },

    // 点击“发布”按钮
    async publish() {
      const content = this.editor?.getHtml() || '';
      if (!this.title.trim()) {
        this.$toast.fail('请填写标题');
        return;
      }
      if (this.questionId) {
        // 编辑已有问题
        try {
          const formData = new FormData();
          formData.append("title", this.title);
          formData.append("content", content);
          const response = await this.$Axios({
            method: 'PUT',
            url: '/qaService/question/update',
            // headers: {
            //   'Content-Type': 'multipart/form-data'
            // },
            params: { 
              questionId: this.questionId, 
              isPost: 1,
            },
            data: formData
          });
          const data = response.data;
          if (data.code === 0 || data.state === 'SUCCESS') {
            this.$toast.success('更新成功！');
            this.$emit('close', { shouldRefresh: true });
          } else {
            this.$toast.fail(data.msg || '更新失败');
          }
        } catch (err) {
          console.error('更新异常', err);
          this.$toast.fail('更新失败，请重试');
        }
      } else {
        try {
          // 第一步：创建问题草稿
          const createRes = await this.$Axios({
            method: 'POST',
            url: '/qaService/question/new',
            params: {
              title: this.title,
              content: content,
            }
          });

          const createData = createRes.data;
          if (createData.state !== 'SUCCESS') {
            this.$toast.fail('发布失败');
            return;
          }

          const newQuestionId = createData.msg; // 拿到新创建的 questionId

          // 第二步：正式发布问题
          const updateRes = await this.$Axios({
            method: 'PUT',
            url: '/qaService/question/update',
            params: { 
              questionId: newQuestionId,
              isPost: 1,
            },
          });

          const updateData = updateRes.data;
          if (updateData.code === 0 || updateData.state === 'SUCCESS') {
            this.$toast.success('发布成功！');
            this.$emit('close', { shouldRefresh: true });
          } else {
            this.$toast.fail('发布失败');
          }
        } catch (err) {
          console.error('发布异常', err);
          this.$toast.fail('发布失败，请重试');
        }
      }
    }
  },

  // Vue 3 中，应使用 beforeUnmount 而不是 beforeDestroy
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
}
</script>

<!-- 如果你需要 wangeditor 的样式，请保持这一行 -->
<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped>
.ask-card {
  max-width: 100%;
  margin: 0 auto;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100vh; /* 整个视口高度 */
  background-color: #fff;
}

.ask-card-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px 3px;
  padding-right: 10px;
}

.ask-card-title {
  font-size: 15px;
  font-weight: 500;
}

.close-btn {
  color: #616161;
  height: 40px !important; /* 确保和发布按钮一致 */
  width: 40px !important;
}

.publish-btn {
  font-size: 13px !important;
  border-radius: 13px !important;
  height: 26px !important;
  min-width: 55px !important;
  align-items: center;
  justify-content: center;
  padding-left: 10px !important;
  padding-right: 10px !important;
  transition: background-color 0.3s ease;
}

.title-input {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 17px;
  border: none;
  outline: none;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 4px 17px;
}

.editorarea {
  padding: 4px 15px;
  flex: 1;
  overflow: auto;
}
</style>
