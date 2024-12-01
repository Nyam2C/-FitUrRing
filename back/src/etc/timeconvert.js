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

    const returnValue = hours * 3600 + minutes * 60 + seconds;

    return returnValue;
}

module.exports = timeToSeconds;
