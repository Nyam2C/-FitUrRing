import Video from '../db/model/video.js';

export default async function addVideo(infoList) {
    try {
        await Video.insertMany(infoList, { ordered: false });
        console.log('Videos added to DB successfully!');
    } catch (err) {
        console.error('Error inserting videos into DB:', err);
    }
}
