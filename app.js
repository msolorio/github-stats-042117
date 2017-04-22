function renderFollowingData(data) {
  console.log('in renderFollowingData');
  data = data.slice(0, 6);
  var resultString = data.map(function(user) {
    return (
      '<div class="user" data-user="' + user.login + '">\
        <h3>' + user.login + '</h3>\
        <img src="' + user.avatar_url + ' alt="avatar" />\
      </div>'
    );
  });
  $('.followingData').html(resultString);
  if (resultString.length) {
    var headingString = (
      '<h2>Following</h2>\
      <h3>Click a user to get their stats</h3>'
    );
    $('.followingData').prepend(headingString);
  }
};

function getFollowingData(login) {
  var followingDataUrl = 'https://api.github.com/users/' + login + '/following';
  var settings = {
    type: 'GET',
    dataType: 'json',
    url: followingDataUrl
  };

  $.ajax(settings)
    .done(function(data) {
      console.log('following data:', data);
      renderFollowingData(data);
    })
    .fail(function(error) {
      console.log('error:', error);
    });
};

function renderUserData(data) {
  var public_repos = data.public_repos || 'No repos';
  var location = data.location || 'None given';

  var resultString = (
    '<h2 class="login">' + data.login + '</h2>\
    <p class="resultParagraph">Public Repos: ' + public_repos + '</p>\
    <p class="resultParagraph">Location: ' + location + '</p>\
    <img src="' + data.avatar_url + '" alt="avatar" />'
  );
    $('.userInfo').html(resultString);
};

function getData(login) {
  var settings = {
    type: 'GET',
    dataType: 'json',
    url: 'https://api.github.com/users/' + login
  };

  $.ajax(settings)
    .done(function(data) {
      console.log('request successful, data:', data);
      renderUserData(data);
      getFollowingData(login);
    })
    .fail(function(error) {
      console.log('there was an error with your request, error:', error);
    })
    .always(function() {
      clearInput();
    });
};

function clearInput() {
  $('.input-login').val('');
}

///////////////////////////////////////////////////////////////////
// EVENT LISTENERS
///////////////////////////////////////////////////////////////////
function listenForUserClick() {
  $('.followingData').on('click', '.user', function(event) {
    var login = $(event.currentTarget).attr("data-user");
    getData(login);
  });
}

function listenForFormSubmit() {
  $('.button').click(function(event) {
    event.preventDefault();

    var login = $('.input-login').val().trim();
    getData(login);
  });
}

//////////////////////////////////////////////////////////////////
// WINDOW LOAD
//////////////////////////////////////////////////////////////////
$(function() {

  listenForFormSubmit();
  listenForUserClick();
});