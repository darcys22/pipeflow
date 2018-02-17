
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
  if (window.flow < 0) {
    window.flow = 0;
  } else if (window.flow>100) {
    window.flow = 100;
  }
  window.USInvert = 126.7;
  window.DSInvert = 126.37;
  window.length = 50;
  window.ManningsCoefficient = 0.013;
  window.InternalDiameter2 = 0.534;
  window.InternalRadius = window.InternalDiameter2/2;
  window.AreaXSect = Math.pow(window.InternalRadius,2)*Math.PI;
  window.FullFlowWettedPerimeter = Math.PI*(2*window.InternalRadius)
  window.HydraulicRadius = window.AreaXSect/window.FullFlowWettedPerimeter;
  window.Grade = (window.USInvert-window.DSInvert)*100/window.length;
  window.mmPipeRoughness = 0.08;
  window.SurfaceRoughness = window.mmPipeRoughness/1000;
  window.KinematicViscosity15DegC = 1.14*Math.pow(10,-6);

  window.ManningsCapacityGravityFlowFull = ((window.AreaXSect*(Math.pow(window.HydraulicRadius,2/3))*(Math.pow(window.Grade/100,0.5)))/window.ManningsCoefficient)*1000;

  console.log(window.AreaXSect);

  window.ColebrookWhiteCapacityFull = -2*Math.sqrt(19.6*window.InternalDiameter2*window.Grade/100)*Math.log10((window.SurfaceRoughness/(3.7*window.InternalDiameter2))+((2.51*window.KinematicViscosity15DegC)/(window.InternalDiameter2*Math.sqrt(19.6*window.InternalDiameter2*(window.Grade/100)))))*window.AreaXSect*1000;

  update();
}

function update() {
  $("#circleflow").attr('data-percent',window.flow);
  $("#flow").html(window.flow * 1000);
  $("#ManningsCap").html(window.ManningsCapacityGravityFlowFull);
  $("#HGLCAP").html(window.ColebrookWhiteCapacityFull);
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
