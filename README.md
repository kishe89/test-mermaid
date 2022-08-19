## Remo Weekly Job Report.

Github 에서 제공하는 ProjectV2(Beta) 를 기반으로 작성되었습니다.

**2022-07-28 현재 기준 GraphQL API 만 제공하여 GraphQL API 호출합니다.**

## Feature

- 프로젝트의 iteration 에 포함되어있는 이슈들을 실행시점의 iteration 과 이전 iteration 으로 정리하여 전주에 작업한 이슈와 현재 주에 작업할 이슈를 PDF 로 출력합니다.

## Installation
1. 해당 레파지토리를 Clone or Download 합니다.
2. `yarn install` 을 레파지토리의 루트 경로에서 실행합니다.
3. [Personal Access Token](https://github.com/settings/tokens/new) 을 필요한 만큼(project, user, issue, repo) 권한을 줘서 생성합니다.
4. 생성한 [Personal Access Token](https://github.com/settings/tokens/new) 을 환경변수 `process.env.GHP_TOKEN` 로 세팅하여 사용합니다.
5. PROJECT_ID 를 `process.env.PROJECT_ID` 환경변수에 세팅합니다.

## Local Usage
실행은 아래와 같이 terminal 이나 쉘에 입력합니다.

이 때 `-t` 옵션의 시간문자는 **YYYY-MM-DD** 로 입력합니다.

환경변수(`.env` 이용 하거나 환경에 직접추가) 세팅을 한경우에는 아래처럼 시간문자만 입력합니다.

`yarn start -t=[시간문자]`

혹은 환경변수가 세팅되어 있지 않다면 아래와 같이 argument 로 입력합니다.

`yarn start -t=[시간문자] -p=[PROJECT_ID] -k=[Personal Access Token]`


## Github actions Usage

깃헙 액션은 `./.github/workflows` 아래에 `cron.yml` 과 `manual.yml` 로 정의 되어있습니다.

`cron.yml`은 cron 을 이용하여 자동으로 돌도록 세팅해놓은 것입니다.

`manual.yml`은 수동으로 깃헙 액션을 실행할 경우를 세팅해놓은 것으로 깃헙 액션 페이지에서 `manual` 작업을 input 값(시간문자) 입력하여 실행합니다.


[매뉴얼액션페이지](https://github.com/remo-web-dev/workPlanArchiveRepository/actions/workflows/manual.yml)에서 메뉴얼로 실행가능합니다.