---
title: "첫 번째 게시글"
date: 2025-01-26
tags: ["JavaScript", "Web", "Blog"]
category: "Development"
description: "GitHub Pages 정적 블로그의 첫 번째 게시글입니다. 마크다운 문법과 코드 하이라이팅을 테스트해보세요."
---

# 첫 번째 게시글에 오신 것을 환영합니다! 🎉

이것은 **Nova Estudio Creative** 블로그의 첫 번째 게시글입니다. 이 블로그는 GitHub Pages를 사용하여 구축된 정적 블로그입니다.

## 주요 기능

이 블로그는 다음과 같은 기능들을 제공합니다:

- 📝 **마크다운 지원**: 게시글을 마크다운으로 작성할 수 있습니다
- 🎨 **다크/라이트 모드**: 사용자 선호도에 따라 테마를 변경할 수 있습니다
- 🔍 **검색 기능**: 게시글 제목, 내용, 태그를 기반으로 검색할 수 있습니다
- 🏷️ **태그 및 카테고리**: 게시글을 분류하고 필터링할 수 있습니다
- 💬 **댓글 시스템**: Giscus를 통한 GitHub Discussions 기반 댓글
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 경험

## 코드 하이라이팅

이 블로그는 Prism.js를 사용하여 코드 하이라이팅을 지원합니다:

```javascript
// JavaScript 예제
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
  return `환영합니다!`;
}

const message = greet("방문자");
console.log(message);
```

```python
# Python 예제
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 피보나치 수열 출력
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

```css
/* CSS 예제 */
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
}

.blog-post h1 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}
```

## 마크다운 문법 테스트

### 목록

**순서가 있는 목록:**

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

**순서가 없는 목록:**

- 항목 1
- 항목 2
- 항목 3

### 인용문

> 이것은 인용문입니다. 중요한 내용이나 다른 사람의 말을 인용할 때 사용합니다.
>
> 여러 줄에 걸친 인용문도 가능합니다.

### 테이블

| 기능            | 설명              | 상태    |
| --------------- | ----------------- | ------- |
| 마크다운 파싱   | marked.js 사용    | ✅ 완료 |
| 코드 하이라이팅 | Prism.js 사용     | ✅ 완료 |
| 다크 모드       | CSS 변수 사용     | ✅ 완료 |
| 검색 기능       | 클라이언트 사이드 | ✅ 완료 |

### 링크와 이미지

- [GitHub Pages](https://pages.github.com/) - 정적 사이트 호스팅
- [marked.js](https://marked.js.org/) - 마크다운 파서
- [Prism.js](https://prismjs.com/) - 코드 하이라이팅

## 마무리

이 블로그는 개발과 창작에 대한 생각을 공유하는 공간입니다. 앞으로 다양한 주제의 게시글을 작성할 예정입니다.

**다음 게시글에서는:**

- 블로그 구축 과정
- 사용된 기술 스택
- 향후 개선 계획

에 대해 자세히 다루어보겠습니다.

---

_이 게시글이 도움이 되었다면 댓글로 의견을 남겨주세요! 💬_
