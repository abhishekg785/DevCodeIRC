  var socket = io.connect(),
      $userForm = $('#userForm'),
      $username = $('#username'),
      $submitUserForm = $('#submitUserForm'),
      $userValidation = $('#userValidation'),
      $validatedSection = $('#validatedSection'),
      $userSection = $('#userSection'),
      $onlineUserListUL = $('#onlineUserList ul'),
      $userChatSection = $('#userChatSection'),
      $messageForm = $('#messageForm'),
      $messageText = $('#messageText'),
      $displayChat = $('#displayChat');


  $userForm.submit(function(e){
    e.preventDefault();
    /*
    * check userame must not exist in the current namespace
    * call add user to add the users in the current user list
    */
    var username = $username.val();
    if(!username){
      alert('Username is required');
    }
    else{
      socket.emit('add user',username,function(data){                   //function(data) is a simple callback for checking whether the user exists on the sever
        if(data){
          console.log('user added');
          $userValidation.hide();
          $validatedSection.show();
        }
        else{
          console.log('user exists');
        }
      });
    }
  });


  //sending message
  $messageText.keypress(function(e){
    if(e.keyCode == 13){
      var message = $messageText.val();
      if(!message){
        alert('Enter message first');
      }
      else{
        socket.emit('new group message',message);
        $messageText.val('');
      }
    }
  });


  //receive message and updates chat
  socket.on('new group message',function(messageObj){
    // console.log(messageObj);
    $displayChat.append('<b>'+ messageObj.user +'</b>' + ':' + messageObj.message + '<br/>');
  });



  socket.on('update user',function(data){
    $onlineUserListUL.empty();
    var userArrLen = data.length;
    var html = "";
    for(var i = 0 ; i <userArrLen; i++){
      html += '<li>'+ data[i] +'</li>';
    }
    $onlineUserListUL.append(html);
  });
