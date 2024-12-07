function secToTime(time){
    let mins = Math.floor(parseInt(time) / 60);
    const secs = parseInt(time) % 60;
    if (mins>60){
        const hrs = Math.floor(mins/60);
        mins = mins%60;
        return  `${hrs}:${mins}:${secs}`;
    }
    return `${mins}:${secs}`;
}

export default secToTime;