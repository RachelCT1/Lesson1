$.ajax({
    type:"get",
    url:"/query",
    data:{
        sql:"select * from data1"
    },
    dataType:"json",
    success:function(data){
        console.log(data)
    }
})
