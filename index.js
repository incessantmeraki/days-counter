var html = require('choo/html')
var choo = require('choo')
var css = require('sheetify')
var differenceInDays = require('date-fns/difference_in_calendar_days')

css('tachyons')

var app = choo()
app.use(logger)
app.use(countStore)
app.route('/', mainView)
app.route('/result', resultView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
    <section class="mw6-ns center bg-yellow pa3 ph5-ns">
      <h1 class="mt0 tc f2">Days Count</h1>
          <form onsubmit=${onCalculate}>
            <div class="mt4 tc">
              <input class="b pa2 ba bg-washed-yellow input-reset measure" type="date" name="date" id="date">
            </div>
            
            <div class="flex items-center justify-center pa4">
            <button class="b f5 no-underline red bg-black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4">
              Calculate
            </button>
            </div>
          </form>
    </section>
    </body>
  `

  function onCalculate (ev) {
    ev.preventDefault()
    var dateElement = ev.target.elements.date
    var targetDate = dateElement.value
    var diff = differenceInDays(targetDate, Date.now())
    diff = diff < 0 ? 0 : diff
    var days = diff
    console.log('days', days)

    // emit calculate event with required value
    emit('calculate', days)
  }
}

function resultView (state, emit) {
  var days = state.days || 0
  if (days == 1) 
    days = days + ' day'
  else
    days = days + ' days'
  return html`
    <body>
      <section class="mw6-ns center bg-yellow pa3 ph5-ns">
        <div class="mt4 tc">
          <p class ="f1"> <b> ${days} remaining </p>
        </div>
    </section>
  </body>
  `
}

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}

function countStore (state, emitter) {
  emitter.on('calculate', function (days) {
    if (days === 0) { emitter.emit('render') } else {
      state.days = days
      emitter.emit('pushState', '/result')
    }
  })
}
