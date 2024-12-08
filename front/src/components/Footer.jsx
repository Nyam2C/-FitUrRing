import react from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './index.css';

function Footer() {
    return (
        <div id="footer">
            <ul>
                <li> 웹시스템설계 </li>
                <li> 9조 </li>
            </ul>
            <ul>
                <li> 백엔드 </li>
                <li> 문경호 </li>
                <li> 김다인 </li>
            </ul>
            <ul>
                <li> 프론트엔드 </li>
                <li> 박태현 </li>
                <li> 장지윤 </li>
            </ul>
            <ul>
                <li>DOCUMENT</li>
                <li><a href='https://git.ajou.ac.kr/wss9/fiturring' className="link" >GitLab</a></li>
                <li><a href='https://www.notion.so/2024-2-130669572a77805db7e8e4f991ad455e?pvs=4' className="link">Notion</a></li>
            </ul>
        </div>
    )
}
export default Footer;