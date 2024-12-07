//영상 시간 변환 함수
export function ptToSeconds(videoduration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = videoduration.match(regex);

    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    const seconds = parseInt(matches[3] || '0', 10);

    // 분과 초를 HH:mm:ss로 변환
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalSeconds;
}
