/**
 * 테마 관리 모듈
 * 다크/라이트 모드 토글 기능을 제공합니다.
 */

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = this.themeToggle?.querySelector(".theme-icon");
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

    this.init();
    console.log("🎨 ThemeManager 초기화 완료:", this.currentTheme);
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }

  getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  getStoredTheme() {
    return localStorage.getItem("theme");
  }

  storeTheme(theme) {
    localStorage.setItem("theme", theme);
    console.log("💾 테마 저장됨:", theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.updateThemeIcon(theme);
    this.storeTheme(theme);
    console.log("🎨 테마 적용됨:", theme);
  }

  updateThemeIcon(theme) {
    if (!this.themeIcon) return;

    this.themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.currentTheme = newTheme;
    this.applyTheme(newTheme);
    console.log("🔄 테마 토글됨:", newTheme);
  }

  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }

    // 시스템 테마 변경 감지
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!this.getStoredTheme()) {
          const systemTheme = e.matches ? "dark" : "light";
          this.currentTheme = systemTheme;
          this.applyTheme(systemTheme);
          console.log("🔄 시스템 테마 변경 감지:", systemTheme);
        }
      });
  }
}

// DOM이 로드되면 테마 매니저 초기화
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
});
