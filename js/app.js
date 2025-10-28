/**
 * 메인 애플리케이션 모듈
 * 게시글 목록 로딩, 필터링, 렌더링을 담당합니다.
 */

class BlogApp {
  constructor() {
    this.postsGrid = document.getElementById("postsGrid");
    this.loading = document.getElementById("loading");
    this.noPosts = document.getElementById("noPosts");
    this.postsCount = document.getElementById("postsCount");
    this.categoryFilter = document.getElementById("categoryFilter");
    this.tagFilter = document.getElementById("tagFilter");
    this.clearFiltersBtn = document.getElementById("clearFilters");

    this.posts = [];
    this.filteredPosts = [];
    this.currentFilters = {
      category: "",
      tag: "",
    };

    this.init();
    console.log("🚀 BlogApp 초기화 완료");
  }

  async init() {
    this.setupEventListeners();
    await this.loadPosts();
    this.setupSearchListener();
  }

  setupEventListeners() {
    // 카테고리 필터
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener("change", (e) => {
        this.currentFilters.category = e.target.value;
        this.applyFilters();
        console.log("🏷️ 카테고리 필터 변경:", e.target.value);
      });
    }

    // 태그 필터
    if (this.tagFilter) {
      this.tagFilter.addEventListener("change", (e) => {
        this.currentFilters.tag = e.target.value;
        this.applyFilters();
        console.log("🏷️ 태그 필터 변경:", e.target.value);
      });
    }

    // 필터 초기화
    if (this.clearFiltersBtn) {
      this.clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
        console.log("🧹 모든 필터 초기화됨");
      });
    }
  }

  setupSearchListener() {
    // 검색 결과 이벤트 리스너
    document.addEventListener("searchResults", (e) => {
      this.filteredPosts = e.detail.posts;
      this.renderPosts();
      console.log("🔍 검색 결과 반영됨:", this.filteredPosts.length, "개");
    });
  }

  async loadPosts() {
    try {
      this.showLoading(true);
      console.log("📝 게시글 데이터 로딩 시작");

      const response = await fetch("posts.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.posts = await response.json();
      this.filteredPosts = [...this.posts];

      console.log("📝 게시글 데이터 로딩 완료:", this.posts.length, "개");

      // 검색 매니저에 게시글 데이터 설정
      if (window.searchManager) {
        window.searchManager.setPosts(this.posts);
      }

      this.populateFilters();
      this.renderPosts();
      this.showLoading(false);
    } catch (error) {
      console.error("❌ 게시글 로딩 실패:", error);
      this.showError("게시글을 불러오는 중 오류가 발생했습니다.");
      this.showLoading(false);
    }
  }

  populateFilters() {
    // 카테고리 필터 채우기
    if (this.categoryFilter) {
      const categories = [
        ...new Set(this.posts.map((post) => post.category).filter(Boolean)),
      ];
      this.categoryFilter.innerHTML =
        '<option value="">전체</option>' +
        categories
          .map((category) => `<option value="${category}">${category}</option>`)
          .join("");
    }

    // 태그 필터 채우기
    if (this.tagFilter) {
      const allTags = this.posts
        .flatMap((post) => post.tags || [])
        .filter(Boolean);
      const uniqueTags = [...new Set(allTags)];
      this.tagFilter.innerHTML =
        '<option value="">전체</option>' +
        uniqueTags
          .map((tag) => `<option value="${tag}">${tag}</option>`)
          .join("");
    }

    console.log("🏷️ 필터 옵션 생성 완료");
  }

  applyFilters() {
    let filtered = [...this.posts];

    // 카테고리 필터 적용
    if (this.currentFilters.category) {
      filtered = filtered.filter(
        (post) => post.category === this.currentFilters.category
      );
    }

    // 태그 필터 적용
    if (this.currentFilters.tag) {
      filtered = filtered.filter(
        (post) => post.tags && post.tags.includes(this.currentFilters.tag)
      );
    }

    this.filteredPosts = filtered;
    this.renderPosts();
    console.log(
      "🏷️ 필터 적용됨:",
      this.currentFilters,
      "-",
      filtered.length,
      "개 결과"
    );
  }

  clearAllFilters() {
    this.currentFilters = { category: "", tag: "" };

    if (this.categoryFilter) {
      this.categoryFilter.value = "";
    }
    if (this.tagFilter) {
      this.tagFilter.value = "";
    }

    this.filteredPosts = [...this.posts];
    this.renderPosts();

    // 검색도 초기화
    if (window.searchManager) {
      window.searchManager.clearSearch();
    }
  }

  renderPosts() {
    if (!this.postsGrid) return;

    // 게시글 개수 업데이트
    if (this.postsCount) {
      this.postsCount.textContent = this.filteredPosts.length;
    }

    // 게시글이 없는 경우
    if (this.filteredPosts.length === 0) {
      this.postsGrid.innerHTML = "";
      this.showNoPosts(true);
      return;
    }

    this.showNoPosts(false);

    // 게시글 카드 생성
    const postsHTML = this.filteredPosts
      .map((post) => this.createPostCard(post))
      .join("");
    this.postsGrid.innerHTML = postsHTML;

    console.log("📝 게시글 렌더링 완료:", this.filteredPosts.length, "개");
  }

  createPostCard(post) {
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const tagsHTML = post.tags
      ? post.tags.map((tag) => `<span class="post-tag">${tag}</span>`).join("")
      : "";

    return `
      <a href="post.html?slug=${post.slug}" class="post-card">
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-description">${post.description || ""}</p>
        <div class="post-card-meta">
          <span class="post-card-date">${formattedDate}</span>
          <div class="post-card-tags">${tagsHTML}</div>
        </div>
      </a>
    `;
  }

  showLoading(show) {
    if (this.loading) {
      this.loading.style.display = show ? "flex" : "none";
    }
  }

  showNoPosts(show) {
    if (this.noPosts) {
      this.noPosts.style.display = show ? "block" : "none";
    }
  }

  showError(message) {
    if (this.postsGrid) {
      this.postsGrid.innerHTML = `
        <div class="error-message">
          <h2>오류가 발생했습니다</h2>
          <p>${message}</p>
        </div>
      `;
    }
    console.error("❌ 에러 메시지 표시:", message);
  }
}

// DOM이 로드되면 블로그 앱 초기화
document.addEventListener("DOMContentLoaded", () => {
  new BlogApp();
});
