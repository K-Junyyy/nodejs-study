const express = require('express');
const app = express();
const port = 3000;

// 서버가 HTML 렌더링 할때 EJS 엔진을 사용하도록 설정
// 서버가 읽을 수 있도록 HTML위치 지정
app.set('view engine', 'ejs');
app.set('views', './views');

// 라우팅 : express 메소드로 localhost:3000 접속시 콜백함수 실행
app.get('/', (req, res) => {
    res.render('index');
});
app.listen(port, () => {
    console.log("Server is running...");
});