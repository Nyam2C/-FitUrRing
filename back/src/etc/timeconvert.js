function timeToSeconds(time) {
    if (!time || typeof time !== 'string') {
        throw new Error('Invalid time format.');
    }

    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        throw new Error(
            'Invalid time format. Ensure the time is in HH:MM:SS format.'
        );
    }

    const formattedTime = hours * 3600 + minutes * 60 + seconds;

    return formattedTime;
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

module.exports = { timeToSeconds, minutesToSeconds, secondsToMinutes };
