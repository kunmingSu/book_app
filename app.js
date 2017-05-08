//引入express框架
const express=require('express');
//实例化express框架
const app=express();

// art-template模板引擎
var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//配置静态资源目录
app.use(express.static('./public'));

//书籍类别路由配置
app.get('/list',(req,res)=>{
    res.render('list');
});

//引入mongoose模块
const db=require('mongoose');
//连接MongoDB数据库
db.connect('mongodb://localhost/text');
//创建数据集合
var bookSchema=db.Schema({
    name:String,
    image:String,
    author:String,
    link:String,
    publisher:String,
    price:Number,
    type:String
});

var Book=db.model('Book',bookSchema);

app.get('/api/v1/book_data/:page',(req,res)=>{
    ///获取请求页的页数
    var currentPage=req.params.page*1;
    Book.find({},function(err,data){
        if(err){
            console.log(err);
        }
        else{
            res.json({status:200,books:data});
        }
    // }).limit(10).skip(currentPage*10);//一页加载10条数据
    }).limit(currentPage*10);
});

//监听端口
app.listen(3000,()=>{
    console.log('Service running at port 3000...');
});