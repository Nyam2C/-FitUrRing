# Project Guildlines
## How To Run In Local

1. Docker 설치
2. git clone
3. docker-compose up -d
4. localhost로 접속
5. 종료는 docker-compose down

## git commit rules
- feat : 새로운 기능 추가
- fix : 버그 수정
- refactor : 코드 리팩토링
- docs : 문서 수정
- chore : 빌드 업무 수정, 패키지 매니저 수정
- style : 코드 스타일 수정
- test : 테스트 코드 추가
- perf : 성능 개선
- ci : CI 설정 수정

예시)
```
Feat: Login Page added

- 로그인 페이지 추가
- fetch함수로 id, pwd 전송
- json 으로 응답 받음
```
- 이렇게 이렇게 개발해서 이러이러한 결과물이 나옴
- 어떠한 문제가 발생하여 무엇을 해결
- 왜 이러한 방법을 사용하여 개발
- 어떻게 변화 하였는지를 중심으로 commit message 작성

## git branch rules
- master
- develop
- feature/기능명

> develop에서 feature/기능명 branch 추가 후 충분한 테스트를 거쳐 develop에 merge.
> 테스트 거친 후 develop에서 master로 merge.

깃 커밋 푸시 후 사이트에서 merge request 후 merge.

## nginx 리버스 프록시
- /api/ 로 들어오는 요청은 모두 백엔드로 전달
- 백엔드는 8080 포트로 실행
- 정적 파일은 /filename 으로 설정
- js파일은 /src/filename 으로 접근 가능

## 코딩 규칙
- html에서 사용되는 js 파일은 파일명 일치시키기
- 파일명은 소문자로 작성(공백은 - 로 대체)
- 컴포넌트 이름은 대문자로 작성
- 함수명은 camelCase 사용(fetchData, getUserInfo 등)

- 이외 추가 사항은 추후 추가

## git 충돌 방지
### 로컬 레포지토리에서 작업중 변경 사항을 불러와야할 상황일때
```sh
git stash // 변경사항 임시저장
git pull -a // 모든 브랜치 변경사항 가져오기
git stash pop // 임시저장한 변경사항 복구
```

### A 브랜치에서 나온 B 브랜치 작업중 A 브랜치의 변경점을 B 브랜치로 바로 가져오고 싶을 때
```sh
git checkout B
git pull -a
git rebase A
```