const app = require('./app');

app()
    .then((app)=>{
        app.listen(app.get('port'),()=>{
            console.log(app.get('port'),'번 포트에서 대기 중');
        })
    })
    .catch((err)=>{
        console.error('서버 실행 오류',err);
    })
