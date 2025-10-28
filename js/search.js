/**
 * 검색 기능 모듈
 * 게시글 제목, 내용, 태그를 기반으로 클라이언트 사이드 검색을 제공합니다.
 */

class SearchManager {
  constructor() {
    this.searchInput = document.getElementById("searchInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.posts = [];
    this.filteredPosts = [];

    this.init();
    console.log("🔍 SearchManager 초기화 완료");
  }

  init() {
    this.setupEventListeners();
  }

  setPosts(posts) {
    this.posts = posts;
    this.filteredPosts = [...posts];
    console.log("📝 게시글 데이터 설정됨:", posts.length, "개");
  }

  setupEventListeners() {
    if (this.searchInput) {
      // 실시간 검색
      this.searchInput.addEventListener("input", (e) => {
        this.performSearch(e.target.value);
      });

      // 엔터키 검색
      this.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performSearch(e.target.value);
        }
      });
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener("click", () => {
        const query = this.searchInput?.value || "";
        this.performSearch(query);
      });
    }
  }

  performSearch(query) {
    if (!query.trim()) {
      this.filteredPosts = [...this.posts];
      console.log("🔍 검색어 없음 - 모든 게시글 표시");
    } else {
      const searchTerm = query.toLowerCase().trim();
      this.filteredPosts = this.posts.filter((post) => {
        return this.matchesSearch(post, searchTerm);
      });
      console.log(
        "🔍 검색 완료:",
        searchTerm,
        "-",
        this.filteredPosts.length,
        "개 결과"
      );
    }

    // 검색 결과 이벤트 발생
    this.dispatchSearchEvent();
  }

  matchesSearch(post, searchTerm) {
    const searchableText = [
      post.title,
      post.description,
      post.category,
      ...(post.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  }

  dispatchSearchEvent() {
    const event = new CustomEvent("searchResults", {
      detail: {
        posts: this.filteredPosts,
        query: this.searchInput?.value || "",
      },
    });
    document.dispatchEvent(event);
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
    }
    this.performSearch("");
    console.log("🧹 검색 초기화됨");
  }

  getFilteredPosts() {
    return this.filteredPosts;
  }
}

// DOM이 로드되면 검색 매니저 초기화
document.addEventListener("DOMContentLoaded", () => {
  window.searchManager = new SearchManager();
});
