/**
 * Created by allenbklj on 9/23/15.
 */

/**
 * ObserverList
  * @type {{observers, add, remove}}
 */
var ObserverList = (function(){
    var observeList = [];
    function add(obj){
        return observeList.push(obj);
    }
    function remove(index){
        observeList.splice(index,1);
    }
    return{
        observers:observeList,
        add:add,
        remove:remove
    }
})();

/**
 * Module for user
 * maintain users and observer list
 * @type {{users, addUser, removeUser, addObserver}}
 */
var model = (function(observers){

    var users = JSON.parse(localStorage.getItem('users')) || [];

    function User(name){
        this.id = generateUUID();
        this.name = name;
    }
    function addUser(name){
        users.push(new User(name));
        localStorage.setItem('users',JSON.stringify(users));
        notify(users);
    }
    function removeUser(index){
        users.splice(index,1);
        localStorage.setItem('users',JSON.stringify(users));
        notify(users);
    }
    function addObserver(obj){
        observers.add(obj);
    }
    function removeObserver(index){
        observers.remove(index);
    }
    function notify(users){
        observers.observers.forEach(function(ele){
            ele.render(users);
        })
    }

    return{
        users:users,
        addUser:addUser,
        removeUser:removeUser,
        addObserver:addObserver
    }
})(ObserverList);

/**
 * Controller handling user interaction
 * @type {{addUser, showUsers, deleteUser}}
 */
var controller = (function(model){

    function showUsers(){
        return model.users;
    }
    function addUser(name){
        model.addUser(name);
    }
    function deleteUser(user){
        var users = model.users;
        for(var i = 0;i<users.length;i++){
           if(users[i].id === user.id){
               model.removeUser(i);
               break;
           }
        }
    }

    return {
        addUser:addUser,
        showUsers:showUsers,
        deleteUser:deleteUser
    }
})(model);

/**
 * View represented the current state of Model
 * @type {{render}}
 */
var view = (function(controller){

    $('#show').on('click',function(){
        render(controller.showUsers());
    });

    $('#add').on('click',function(){
        $('#content').html('<input type="text" id="name"/><button id="adduser">add user</button>');
        $('#adduser').on('click',function(){
            controller.addUser($('#name').val());
        });
    });

    function render(users){
        var html = '<ul>';

        for(var i = 0;i<users.length;i++){
            html += '<li>'+users[i].name+'<button id="delete_'+ i + '">delete</button></li>';
        }
        html += '</ul>';
        $('#content').html(html);

        $('[id^="delete_"]').each(function(index,ele){
            $(this).data('user',users[index]);
        });

        $('[id^="delete_"]').on('click',function(){
            controller.deleteUser($(this).data('user'));
        });
    }

    return{
        render:render
    }

})(controller);

/**
 * Create UUID for user
 * @returns {string}
 */
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

/**
 * add view as observer for model
 */
model.addObserver(view);

