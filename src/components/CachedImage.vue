<template>
  <img
    ref="img"
    :alt="alt"
    :style="computedStyle"
    :class="computedClass"
    @load="onLoad"
    @error="onError"
  />
</template>

<script>
import imageCache from '@/utils/imageCache';

export default {
  name: 'CachedImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    lazy: {
      type: Boolean,
      default: true
    },
    width: [String, Number],
    height: [String, Number],
    objectFit: {
      type: String,
      default: 'cover'
    },
    borderRadius: [String, Number],
    className: String,
    placeholder: {
      type: String,
      default: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">加载中...</text></svg>'
    }
  },
  data() {
    return {
      loaded: false,
      error: false
    };
  },
  computed: {
    computedStyle() {
      const style = {
        objectFit: this.objectFit,
        transition: 'opacity 0.3s ease'
      };
      
      if (this.width) {
        style.width = typeof this.width === 'number' ? `${this.width}px` : this.width;
      }
      
      if (this.height) {
        style.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
      }
      
      if (this.borderRadius) {
        style.borderRadius = typeof this.borderRadius === 'number' ? `${this.borderRadius}px` : this.borderRadius;
      }
      
      return style;
    },
    computedClass() {
      return this.className || '';
    }
  },
  mounted() {
    this.loadImage();
  },
  watch: {
    src() {
      this.loaded = false;
      this.error = false;
      this.loadImage();
    }
  },
  methods: {
    loadImage() {
      if (!this.src) return;
      
      const img = this.$refs.img;
      if (!img) return;
      
      if (this.lazy) {
        // 使用懒加载
        imageCache.lazyLoad(img, this.src);
      } else {
        // 直接加载
        imageCache.loadImage(this.src)
          .then(blob => {
            img.src = URL.createObjectURL(blob);
          })
          .catch(err => {
            console.error('图片加载失败:', err);
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">加载失败</text></svg>';
            this.error = true;
            this.$emit('error', err);
          });
      }
    },
    onLoad() {
      this.loaded = true;
      this.$emit('load');
    },
    onError(err) {
      this.error = true;
      this.$emit('error', err);
    }
  },
  beforeDestroy() {
    // 清理可能的 blob URL
    const img = this.$refs.img;
    if (img && img.src && img.src.startsWith('blob:')) {
      URL.revokeObjectURL(img.src);
    }
  }
};
</script>

<style scoped>
img {
  display: block;
  background-color: #f0f0f0;
}
</style> 