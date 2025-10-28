/**
 * 게시글 로더 모듈
 * 마크다운 파일을 로드하고 파싱하여 HTML로 변환합니다.
 * Giscus 댓글 시스템도 관리합니다.
 */

class PostLoader {
  constructor() {
    this.postContainer = document.getElementById("postContainer");
    this.postTitle = document.getElementById("postTitle");
    this.postDate = document.getElementById("postDate");
    this.postTags = document.getElementById("postTags");
    this.postCategory = document.getElementById("postCategory");
    this.postContent = document.getElementById("postContent");
    this.pageTitle = document.getElementById("pageTitle");
    this.commentsSection = document.getElementById("commentsSection");

    this.init();
    console.log("📄 PostLoader 초기화 완료");
  }

  init() {
    this.loadPost();
  }

  async loadPost() {
    try {
      const postSlug = this.getPostSlugFromURL();
      console.log("📄 게시글 로딩 시작:", postSlug);

      if (!postSlug) {
        this.showError("게시글을 찾을 수 없습니다.");
        return;
      }

      // posts.json에서 게시글 메타데이터 로드
      const postsData = await this.loadPostsData();
      const postMeta = postsData.find((post) => post.slug === postSlug);

      if (!postMeta) {
        this.showError("게시글을 찾을 수 없습니다.");
        return;
      }

      console.log("📄 게시글 메타데이터 로드됨:", postMeta);

      // 마크다운 파일 로드
      const markdownContent = await this.loadMarkdownFile(postMeta.file);
      console.log("📄 마크다운 파일 로드됨:", postMeta.file);

      // Front Matter 파싱
      const { frontMatter, content } = this.parseFrontMatter(markdownContent);
      console.log("📄 Front Matter 파싱됨:", frontMatter);

      // HTML로 변환
      const htmlContent = this.convertMarkdownToHTML(content);
      console.log("📄 마크다운 → HTML 변환 완료");

      // 페이지 렌더링
      this.renderPost(frontMatter, htmlContent);
      console.log("📄 게시글 렌더링 완료");

      // 코드 하이라이팅 적용
      this.highlightCode();
      console.log("📄 코드 하이라이팅 적용 완료");

      // Giscus 댓글 로드
      this.loadGiscus();
      console.log("📄 Giscus 댓글 로드 시작");
    } catch (error) {
      console.error("❌ 게시글 로딩 실패:", error);
      this.showError("게시글을 불러오는 중 오류가 발생했습니다.");
    }
  }

  getPostSlugFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("slug");
  }

  async loadPostsData() {
    try {
      const response = await fetch("posts.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("❌ posts.json 로딩 실패:", error);
      throw error;
    }
  }

  async loadMarkdownFile(filename) {
    try {
      const response = await fetch(`pages/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("❌ 마크다운 파일 로딩 실패:", error);
      throw error;
    }
  }

  parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
      // Front Matter가 없는 경우 기본값 사용
      return {
        frontMatter: {
          title: "제목 없음",
          date: new Date().toISOString().split("T")[0],
          tags: [],
          category: "기타",
          description: "",
        },
        content: content,
      };
    }

    const frontMatterText = match[1];
    const contentText = match[2];

    // 간단한 YAML 파싱
    const frontMatter = {};
    const lines = frontMatterText.split("\n");

    for (const line of lines) {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) continue;

      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // 따옴표 제거
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // 배열 파싱
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/['"]/g, ""))
          .filter((item) => item);
      }

      frontMatter[key] = value;
    }

    return { frontMatter, content: contentText };
  }

  convertMarkdownToHTML(markdown) {
    // marked.js 설정
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false,
    });

    return marked.parse(markdown);
  }

  renderPost(frontMatter, htmlContent) {
    // 제목 설정
    if (this.postTitle) {
      this.postTitle.textContent = frontMatter.title || "제목 없음";
    }

    if (this.pageTitle) {
      this.pageTitle.textContent = `${frontMatter.title} - Nova Estudio Creative Blog`;
    }

    // 날짜 설정
    if (this.postDate) {
      const date = new Date(frontMatter.date);
      this.postDate.textContent = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // 카테고리 설정
    if (this.postCategory) {
      this.postCategory.textContent = frontMatter.category || "기타";
    }

    // 태그 설정
    if (this.postTags && frontMatter.tags) {
      this.postTags.innerHTML = frontMatter.tags
        .map((tag) => `<span class="post-tag">${tag}</span>`)
        .join("");
    }

    // 내용 설정
    if (this.postContent) {
      this.postContent.innerHTML = htmlContent;
    }
  }

  highlightCode() {
    // Prism.js 코드 하이라이팅 적용
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  }

  loadGiscus() {
    // Giscus 설정
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute(
      "data-repo",
      "novaestudiocreative/novaestudiocreative.github.io"
    );
    script.setAttribute("data-repo-id", "YOUR_REPO_ID"); // 사용자가 설정해야 함
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID"); // 사용자가 설정해야 함
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    // 기존 Giscus 스크립트 제거
    const existingScript = document.querySelector('script[src*="giscus.app"]');
    if (existingScript) {
      existingScript.remove();
    }

    // 새로운 스크립트 추가
    if (this.commentsSection) {
      this.commentsSection.appendChild(script);
      console.log("💬 Giscus 스크립트 로드됨");
    }
  }

  showError(message) {
    if (this.postContent) {
      this.postContent.innerHTML = `
        <div class="error-message">
          <h2>오류가 발생했습니다</h2>
          <p>${message}</p>
          <a href="/" class="back-to-list">← 목록으로 돌아가기</a>
        </div>
      `;
    }
    console.error("❌ 에러 메시지 표시:", message);
  }
}

// DOM이 로드되면 게시글 로더 초기화
document.addEventListener("DOMContentLoaded", () => {
  new PostLoader();
});
