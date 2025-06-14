class ImageCache {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.observer = null;
    this.lazyElements = new Set();
    this.initIntersectionObserver();
  }

  // 初始化懒加载观察器
  initIntersectionObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              this.loadImage(src).then(blob => {
                img.src = URL.createObjectURL(blob);
                img.removeAttribute('data-src');
                this.observer.unobserve(img);
                this.lazyElements.delete(img);
              }).catch(err => {
                console.error('图片加载失败:', err);
                // 设置占位图
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">加载失败</text></svg>';
                this.observer.unobserve(img);
                this.lazyElements.delete(img);
              });
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1
      });
    }
  }

  // 加载并缓存图片
  async loadImage(url) {
    // 如果已经缓存，直接返回
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // 如果正在加载，返回加载Promise
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // 开始加载
    const loadPromise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // 缓存图片
        this.cache.set(url, blob);
        this.loadingPromises.delete(url);
        return blob;
      })
      .catch(err => {
        this.loadingPromises.delete(url);
        throw err;
      });

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  // 预加载图片
  preloadImage(url) {
    if (!this.cache.has(url) && !this.loadingPromises.has(url)) {
      this.loadImage(url).catch(() => {
        // 静默处理预加载错误
      });
    }
  }

  // 批量预加载图片
  preloadImages(urls) {
    urls.forEach(url => this.preloadImage(url));
  }

  // 懒加载图片元素
  lazyLoad(imgElement, src) {
    if (!this.observer) {
      // 如果不支持 IntersectionObserver，直接加载
      this.loadImage(src).then(blob => {
        imgElement.src = URL.createObjectURL(blob);
      }).catch(err => {
        console.error('图片加载失败:', err);
        imgElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">加载失败</text></svg>';
      });
      return;
    }

    // 设置占位图
    imgElement.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">加载中...</text></svg>';
    imgElement.dataset.src = src;
    
    this.lazyElements.add(imgElement);
    this.observer.observe(imgElement);
  }

  // 清理缓存（当内存使用过多时）
  clearCache() {
    // 清理 blob URLs
    this.cache.forEach(blob => {
      if (blob instanceof Blob) {
        URL.revokeObjectURL(blob);
      }
    });
    this.cache.clear();
  }

  // 获取缓存大小（近似值）
  getCacheSize() {
    let size = 0;
    this.cache.forEach(blob => {
      if (blob instanceof Blob) {
        size += blob.size;
      }
    });
    return size;
  }

  // 清理懒加载观察器
  cleanup() {
    if (this.observer) {
      this.lazyElements.forEach(element => {
        this.observer.unobserve(element);
      });
      this.lazyElements.clear();
    }
  }
}

// 创建全局实例
const imageCache = new ImageCache();

export default imageCache; 