// ----
// DATA
// ----

// A couple jokes to start with
var DEFAULT_JOKES = {
  'the horse': {
    setup: 'A horse walks into the bar. The bartender asks...',
    punchline: 'Why the long face?'
  },
  'Orion\'s pants': {
    setup: 'How does Orion keep his pants up?',
    punchline: 'With an asteroid belt.'
  }
}

var jokes = []

function loadJokes() {
  found = window.localStorage.getItem('jokes')
  jokes = found && found.length > 0
      ? JSON.parse(found)
      : JSON.parse(JSON.stringify(DEFAULT_JOKES))
}

function storeJokes() {
  window.localStorage.setItem('jokes', JSON.stringify(jokes))
}

// The message to display if the jokes object is empty
var NO_JOKES_MESSAGE = 'I... I don\'t know any jokes. 😢'
var JOKE_NOT_FOUND_MESSAGE = 'No matching joke found.'

// -------------
// PAGE UPDATERS
// -------------

// Update the listed jokes, based on the jokes object
var jokesMenuList = document.getElementById('jokes-menu')
var updateJokesMenu = function () {
  // Don't worry too much about this code for now.
  // You'll learn how to do advanced stuff like
  // this in a later lesson.
  var jokeKeys = Object.keys(jokes)
  // Now make them working buttons
  var joke2 = []
  for (joke in jokes) {
    var j = '<input type="button" onclick="setJoke(\''+superescape(joke)+'\')" value="'+joke+'"/>'
    joke2.push(j)
  }
  var jokeKeyListItems = joke2.join('</li><li>') || NO_JOKES_MESSAGE 
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

var setJoke = function(joke) {
  document.getElementById('requested-joke').value=joke
  updateDisplayedJoke()
}

var newJokeButton = document.getElementById('new-joke')
var newJokeTitleElement = document.getElementById('new-joke-title')
var newJokeSetupElement = document.getElementById('new-joke-setup')
var newJokePunchElement = document.getElementById('new-joke-punch')
var storeNewJoke = function() { if (!newJokeTitleElement.value || !newJokeSetupElement.value || !newJokePunchElement.value) {
    window.alert('You must enter a value for every field!')
    return
  }
  if (jokes[newJokeTitleElement.value]
    && !window.confirm('Are you sure you want to override the existing joke?')) {
    return
  }
  var newJoke = { setup: newJokeSetupElement.value, punchline: newJokePunchElement.value }
  jokes[newJokeTitleElement.value] = newJoke

  storeJokes()
  updateJokesMenu()
  updateDisplayedJoke()
}

var forgetJokeButton = document.getElementById('forget-joke')
var forgetJokeTitle = document.getElementById('forget-joke-title')
var forgetJoke = function() {
  if (!forgetJokeTitle.value) {
    window.alert('What should I forget?')
    return
  }
  if (!jokes[forgetJokeTitle.value]) {
    window.alert('I can\'t forget what I don\'t know!')
    return
  }
  delete jokes[forgetJokeTitle.value]
  storeJokes()
  updateJokesMenu()
  updateDisplayedJoke()
}

// Update the displayed joke, based on the requested joke
var requestedJokeInput = document.getElementById('requested-joke')
var jokeBox = document.getElementById('joke-box')
var updateDisplayedJoke = function () {
  var requestedJokeKey = requestedJokeInput.value
  var found = jokes[requestedJokeKey]
  jokeBox.innerHTML = found 
    ? '<p>'+superescape(found.setup)+'</p><p>'+superescape(found.punchline)+'</p>'
    : JOKE_NOT_FOUND_MESSAGE
}

// Function to keep track of all other
// page update functions, so that we
// can call them all at once
var updatePage = function () {
  loadJokes()
  updateJokesMenu()
  updateDisplayedJoke()
}

// -------
// STARTUP
// -------

// Update the page immediately on startup
updatePage()

// ---------------
// EVENT LISTENERS
// ---------------

// Keep the requested joke up-to-date
newJokeButton.addEventListener('click', storeNewJoke)
requestedJokeInput.addEventListener('input', updateDisplayedJoke)
forgetJokeButton.addEventListener('click', forgetJoke)

/**
 * Shamelessly taken from https://github.com/joliss/js-string-escape!
 */
function superescape(string) {
  return ('' + string).replace(/["'\\\n\r\u2028\u2029]/g, function (character) {
    // Escape all characters not included in SingleStringCharacters and
    // DoubleStringCharacters on
    // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
    switch (character) {
      case '"':
      case "'":
      case '\\':
        return '\\' + character
        // Four possible LineTerminator characters need to be escaped:
      case '\n':
        return '\\n'
      case '\r':
        return '\\r'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
    }
  })
}
