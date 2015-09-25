/**
 * Created by allenbklj on 9/24/15.
 */
var injector = (function(){

    var dependencies = [];
    var cache = {};

    function register(name,obj){
        if(!has(name)){
            dependencies.push(name);
            cache[name] = obj;
        }
    }

    function get(name){

        if(dependencies.indexOf(name) !== -1){
            return cache[name];
        }
    }

    function has(name){
        if(dependencies.indexOf(name) !== -1){
            return true;
        }else{
            return false;
        }
    }

    function invoke(){
        var fn = arguments[0];
        var scope = arguments[1] || {};
        var dep = fn.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(',');
        return function(){
            var arg = [];
            for(var i = 0;i<dep.length;i++){
                console.log(dep[i]);
                arg.push(has(dep[i]) && dep[i] !== '' ? get(dep[i]) : Array.prototype.shift.call(arguments));
            }
            console.log(arg);
            fn.apply(scope,arg);
        }

    }
    return{
        register:register,
        invoke:invoke
    }
})();

var filter = {upperCase:function(origin){return origin.toUpperCase();}};


function test(sex,$filter){
    var newsex = $filter.upperCase(sex);
    console.log(newsex);
    return newsex;
}

injector.register('$filter',filter);
var result = injector.invoke(test);
var a = result('male');
console.log(a);
