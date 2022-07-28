## Remo Weekly Job Report.

Github 에서 제공하는 ProjectV2(Beta) 를 기반으로 작성되었습니다.

**2022-07-28 현재 기준 GraphQL API 만 제공하여 GraphQL API 호출합니다.**

## Feature

- 프로젝트의 iteration 에 포함되어있는 이슈들을 실행시점의 iteration 과 이전 iteration 으로 정리하여 전주에 작업한 이슈와 현재 주에 작업할 이슈를 PDF 로 출력합니다.

## Installation
1. 해당 레파지토리를 Clone or Download 합니다.
2. `yarn install` 을 레파지토리의 루트 경로에서 실행합니다.
3. [Personal Access Token](https://github.com/settings/tokens/new) 을 필요한 만큼(project, user, issue, repo) 권한을 줘서 생성합니다.
4. 생성한 [Personal Access Token](https://github.com/settings/tokens/new) 을 환경변수 `process.env.GH_TOKEN` 로 세팅하여 사용합니다.
5. 프로젝트 루트에서 `yarn start` 를 실행합니다.
