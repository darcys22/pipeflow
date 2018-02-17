
$('#flowpercentInput').on('input', function () {
    window.flow = stripwhitecommas($('#flowpercentInput').val());
    calculate();
});
$('#settingsModal').on('hidden.bs.modal', function () {
    editSettings();
});

function editSettings() {
}

function calculate() {
  console.log(window.flow);
  if (window.flow < 0) {
    window.flow = 0;
  } else if (window.flow>100) {
    window.flow = 100;
  }
  $("#circleflow").attr('data-percent',window.flow);
}

function stripwhitecommas(str) {
  if (!str || 0 === str.length) {
    return str
  } else {
    return str.toString().replace(/[\s,]+/g,'').trim()
  }
}

function formatcomma(element) {
  return element.toString().replace(/ /g,'').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function main() {
  window.flow=50;
  calculate();
}
main();
