'use strict'

const langs = {
  "node.js": "js",
  python: "py",
  go: "go",
  c: "c",
  "c++": "cpp",
  java: "java"
}
const apps = {
  helloworld: [
    "node.js",
    "python",
    "go",
    "java",
    "c",
    "c++"
  ],
  discord: [
    "node.js",
    "python"
  ],
  web: [
    "go"
  ]
}

if (new Date().getMilliseconds() % 2 == 0) $("#programmer-emoji").text("👨‍💻")
else $("#programmer-emoji").text("👩‍💻")

let useApp = "helloworld"
let useLanguage = "js"
$('#app-selector').change(() => {
  useApp = $('#app-selector').val()
  initCommand()
  useLanguage = $('#language-selector').val()
});
$('#language-selector').change(() => useLanguage = $('#language-selector').val());

function highlightBlock() {
  $('pre code#result').attr('class', `${useLanguage} user-select-all`)
  $('pre code#result').each((_, block) => hljs.highlightBlock(block))
}

function _getCode(app, data) {
  function a() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: "http://roomprogrammerapi.herokuapp.com/" + app,
        data: data,
        success(resp) {
          resolve(resp)
        },
        error(err) {
          reject(err)
        }
      })
    })
  }
  a().then(resp => {
    console.log(resp)
    $("pre code").text(resp["result"])
    highlightBlock()
    if (resp["message"] !== "ok") alert(resp["message"])
  })
}

function getDiscordCode() {
  const len = $("#keys-values > div").length
  let commands = []
  let answers = []
  for (let i = 1; i <= len; i++) {
    let command = $(`#keys-values > div:nth-child(${i}) .first`).val()
    let answer = $(`#keys-values > div:nth-child(${i}) .second`).val()
    if (command.indexOf(',') > -1 || answer.indexOf(',') > -1) {
      alert("콤마(,)는 명령어나 대답 자리에 들어갈 수 없습니다.")
      return
    }
    if (answers === '') {
      alert('비어있는 대답은 지원되지 않습니다.')
      return
    }
    commands.push(command)
    answers.push(answer)
  }

  const prefix = $("#inputs .input-group input").val()
  _getCode("discord", {
    language: useLanguage,
    prefix: prefix,
    commands: commands.join(','),
    answers: answers.join(',')
  })
}

function getWebCode() {
  const len = $("#keys-values > div").length
  let paths = []
  let values = []
  for (let i = 1; i <= len; i++) {
    let command = $(`#keys-values > div:nth-child(${i}) .first`).val()
    let answer = $(`#keys-values > div:nth-child(${i}) .second`).val()
    if (command.indexOf(',') > -1 || answer.indexOf(',') > -1) {
      alert("콤마(,)는 경로나 값에 들어갈 수 없습니다.")
      return
    }
    if (values === '') {
      alert('비어있는 대답은 지원되지 않습니다.')
      return
    }
    paths.push(command)
    values.push(answer)
  }

  _getCode('web', {
    language: useLanguage,
    paths: paths.join(','),
    values: values.join(',')
  })
}

function getCode() {
  if (confirm('실제로 만드시겠습니까?\n시간이 좀 소요될 수 있습니다.')) {
    switch (useApp) {
      case 'discord':
        getDiscordCode()
        break
      case 'web':
        getWebCode()
        break
      case 'helloworld':
        _getCode("helloworld", { language: useLanguage })
        break
    }
  }
}

function addKeyValueInput(message) {
  let value
  while (true) {
    const uid = new ShortUniqueId();
    value = uid() + uid() + uid() + uid() + uid() + uid() + uid() + uid() + String(new Date().getMilliseconds())
    if (document.getElementById("input-" + value) === null) break
  }

  $("#keys-values").append(`<div id="input-${value}" class="input-group">
              <div class="input-group-prepend">
                <span id="key-value" class="input-group-text"
                  >${message}</span
                >
                <span class="input-group-text" onclick="deleteKeyValueInput('${value}')"
                  >삭제</span
                >
              </div>
              <input type="text" class="form-control first" />
              <input type="text" class="form-control second" />
            </div>`)

}

function deleteKeyValueInput(key) {
  $("#input-" + key).remove()
}

function initCommand() {
  switch (useApp) {
    case 'discord':
      $("#command").html(`<div id="inputs">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="prefix-input"
                >접두사 입력</span
              >
            </div>
            <input
              type="text"
              class="form-control"
              aria-describedby="prefix-input"
            />
          </div>

          <div id="keys-values"></div>
        </div>

        <br />

        <button onclick="addKeyValueInput('명령어, 대답')">명령어, 대답 추가하기</button>`)
      break
    case 'web':
      $("#command").html(`<div id="inputs">
          <div id="keys-values"></div>
        </div>

        <br />

        <button onclick="addKeyValueInput('웹 경로(path) (슬러시 (/)포함 입력), 출력값')">웹 경로, 출력값 추가하기</button>`)
      break
    default:
      $('#command').html('')
      break
  }

  $('#language-selector').empty()
  const app = apps[useApp]
  for (let i = 0; i < app.length; i++)
    $('#language-selector').append(`<option value="${langs[app[i]]}">${app[i]}</option>`)
  $('#language-selector').html()
}
initCommand()

$(function () {
  var overlay = $('<div id="overlay"></div>');
  overlay.show();
  overlay.appendTo(document.body);
  $('.popup').show();
  $('.close').click(function () {
    $('.popup').hide();
    overlay.appendTo(document.body).remove();
    return false;
  });

  $('.x').click(function () {
    $('.popup').hide();
    overlay.appendTo(document.body).remove();
    return false;
  });
});