async function getEntireVideos(page){
    const body = {
        page: page,
        video_per_page: 15,
    }
    try{
        const uri = `/api/video`
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok){
            return data;
        }
        else{
            throw new Error(data.message);
        }
    } catch(err){
        console.log(err.message);
    }
}

async function searchVideos(body){
    const filters = {
        video_tag: body.video_tag?body.video_tag:null,
        video_time_from: body.video_time_from?body.video_time_from:null,
        video_time_to: body.video_time_to?body.video_time_to:null,
        video_level: body.video_level?body.video_level:null,
    };
    try{
        const uri = `/api/video/tag`
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filters),
        });
        const data = await response.json();
        if (response.ok){
            return data;
        }
        else{
            throw new Error(data.message);
        }
    } catch(err){
        console.log(err.message);
    }
}

export default { getEntireVideos, searchVideos };
