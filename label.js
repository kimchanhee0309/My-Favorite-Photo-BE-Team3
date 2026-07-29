import "dotenv/config";
import githubLabelSync from "github-label-sync";

githubLabelSync({
  accessToken: process.env.GITHUB_TOKEN,
  repo: "kimchanhee0309/My-Favorite-Photo-BE-Team3",
  labels: [
    {
      name: "☕ Chore",
      color: "4D6A8B",
      description:
        ".gitignore 처럼 외부 사용자가 관심없는 파일, 빌드 혹은 패키지 매니저 수정 사항",
    },
    {
      name: "⚙ Setting",
      color: "424242",
      description: "환경 설정",
    },
    {
      name: "✒ Docs",
      color: "C5DEF5",
      description: "문서 생성 및 수정",
    },
    {
      name: "❗ Invalid",
      color: "FEF2C0",
      description: "잘못된 부분이 있어보임",
    },
    {
      name: "✅ Test",
      color: "FFFFFF",
      description: "테스트 관련 수정, 빌드 업무 및 패키지 매니저 수정",
    },
    {
      name: "✨ Feat",
      color: "C2E0C6",
      description: "새 기능 추가",
    },
    {
      name: "🎨 Design",
      color: "D0F5A9",
      description: "CSS 등 사용자 UI, 디자인 변경",
    },
    {
      name: "🏷 Rename",
      color: "F5D0A9",
      description: "파일/폴더 명 변경 혹은 이동 등 구조 변경",
    },
    {
      name: "🐞 Bug",
      color: "F9D0C4",
      description: "버그 발생 보고 및 해결 기록",
    },
    {
      name: "💡 Question",
      color: "D4C5F9",
      description: "질문",
    },
    {
      name: "🗑 Remove",
      color: "D8D8D8",
      description: "파일삭제",
    },
    {
      name: "🚀 Refactor",
      color: "E2A9F3",
      description:
        "기존 코드의 입출력 값은 일치, 코드 내부 성능 개선 및 클린업",
    },
    {
      name: "🛠 Fix",
      color: "CEF6D8",
      description: "기능 수정",
    },
    {
      name: "🧨 HotFix",
      color: "FBCA04",
      description: "급하게 치명적인 버그를 고쳐야 하는 경우",
    },
    {
      name: "🧵 Style",
      color: "A9F5A9",
      description:
        "코드 포맷 변경, 세미콜론 누락 등 스타일과 관련된 코드 수정, 그러나 코드 수정은 없는 경우",
    },
  ],
  dryRun: false,
})
  .then((diff) => {
    console.log(diff);
  })
  .catch((error) => {
    console.error(error);
  });
///
