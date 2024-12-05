function ptToSeconds(time) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = time.match(regex);

    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    const seconds = parseInt(matches[3] || '0', 10);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalSeconds;
}

function minutesToSeconds(time) {
    if (!time || typeof time !== 'string') {
        throw new Error('Invalid time format.');
    }

    const [minutes, seconds] = time.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) {
        throw new Error(
            'Invalid time format. Ensure the time is in MM:SS format.'
        );
    }

    const formattedTime = minutes * 60 + seconds;

    return formattedTime;
}

function secondsToMinutes(timeInSeconds) {
    if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds)) {
        throw new Error('Invalid input. Time must be a number.');
    }

    const minutes = Math.floor(timeInSeconds / 60); // 분
    const seconds = timeInSeconds % 60; // 나머지 초

    const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;

    return formattedTime;
}

module.exports = {
    ptToSeconds,
    minutesToSeconds,
    secondsToMinutes,
};
