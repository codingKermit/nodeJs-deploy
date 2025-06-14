const app = require('./app');

console.log('여기서는??? : ',process.env.NODE_ENV);

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
})
