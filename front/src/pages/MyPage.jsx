import react, { useState, useEffect } from 'react';

function MyPage(){
    useEffect(() => {
        //뭐할거임
    }, []);
    return (
        <div id="mypage">
            <table>
                <tr>
                    <th>성함</th>
                    <td>김ㅇㅇ</td>
                </tr>
            </table>
        </div>
    )
}
export default MyPage;