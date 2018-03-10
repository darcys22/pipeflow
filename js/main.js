
$('input').on('input', function () {
    window.flow = stripwhitecommas($('#flowpercentInput').val());
    window.InternalDiameter2 = stripwhitecommas($('#internaldiameterInput').val());
    window.USInvert = stripwhitecommas($('#USInvertInput').val());
    window.DSInvert = stripwhitecommas($('#DSInvertInput').val());
    window.length = stripwhitecommas($('#lengthInput').val());
    window.ManningsCoefficient = stripwhitecommas($('#manningsInput').val());
    window.mmPipeRoughness = stripwhitecommas($('#piperoughnessInput').val());
    calculate();
});
$('#settingsModal').on('hidden.bs.modal', function () {
    editSettings();
});

function editSettings() {
}

function calculate() {
  window.PartFlowDepth = 0.417370290267081;
  window.UpstreamPitLossCoeff = 1;
  window.decimalflow = window.flow;
  //window.USInvert = 126.7;
  //window.DSInvert = 126.37;
  //window.length = 50;
  //window.ManningsCoefficient = 0.013;
  //window.InternalDiameter2 = 0.534;
  window.InternalRadius = window.InternalDiameter2/2;
  window.AreaXSect = Math.pow(window.InternalRadius,2)*Math.PI;
  window.Velocity = window.decimalflow/window.AreaXSect;
  window.VelocityHead = Math.pow(window.Velocity,2)/(2*9.8)
  window.UpstreamPitLoss = window.UpstreamPitLossCoeff*Math.pow(window.Velocity,2)/(2*9.8)
  window.FullFlowWettedPerimeter = Math.PI*(2*window.InternalRadius)
  window.HydraulicRadius = window.AreaXSect/window.FullFlowWettedPerimeter;
  window.Grade = (window.USInvert-window.DSInvert)*100/window.length;
  window.mmPipeRoughness = 0.08;
  window.SurfaceRoughness = window.mmPipeRoughness/1000;
  window.KinematicViscosity15DegC = 1.14*Math.pow(10,-6);
  window.ReynoldsNumber = window.Velocity*window.InternalDiameter2/window.KinematicViscosity15DegC;
  //ReynoldsFlow: 1 = Laminar Flow, 2 = Transitional Flow, 3 = Turbulent Flow
  window.ReynoldsFlow = 3;
  if(window.ReynoldsNumber < 2100) {
    window.ReynoldsFlow = 1;
  } else if (window.ReynoldsNumber < 5000) {
    window.ReynoldsFlow = 2;
  }


  window.RelativeRoughness = window.SurfaceRoughness/window.InternalDiameter2;
  window.MoodysFrictionFactor = 0;
  if (window.ReynoldsFlow == 1) {
    window.MoodysFrictionFactor = 64/window.ReynoldsNumber;
  } else if ((window.ReynoldsFlow == 3) && (Math.pow(10,-6)<window.RelativeRoughness) && (window.RelativeRoughness<Math.pow(10,-2))) {
    window.MoodysFrictionFactor = 1.325/Math.pow((Math.log(window.SurfaceRoughness/(3.7*window.InternalDiameter2)+(5.74/Math.pow(window.ReynoldsNumber,0.9)))),2)
  }
  window.DarcyWeisbachMajorLoss = window.MoodysFrictionFactor*(window.length/window.InternalDiameter2)*(Math.pow(window.Velocity,2)/(2*9.81));
  window.FrictionSlope = window.DarcyWeisbachMajorLoss*100/window.length;

  window.ManningsCapacityGravityFlowFull = ((window.AreaXSect*(Math.pow(window.HydraulicRadius,2/3))*(Math.pow(window.Grade/100,0.5)))/window.ManningsCoefficient)*1000;

  window.ColebrookWhiteCapacityFull = -2*Math.sqrt(19.6*window.InternalDiameter2*window.Grade/100)*Math.log10((window.SurfaceRoughness/(3.7*window.InternalDiameter2))+((2.51*window.KinematicViscosity15DegC)/(window.InternalDiameter2*Math.sqrt(19.6*window.InternalDiameter2*(window.Grade/100)))))*window.AreaXSect*1000;

  window.PartFlowDepth = numeric.uncmin(partialflowdelta,[window.InternalRadius]).solution[0];

  window.AboveSpringline = window.decimalflow>(0.5*(ManningsCapacityGravityFlowFull/1000));
  if (window.AboveSpringline) {
    window.SegmentH = window.InternalDiameter2 - window.PartFlowDepth;
    window.SegmentTheta = 2*Math.acos((window.InternalRadius-window.SegmentH)/window.InternalRadius);
    window.SegmentA = (Math.PI*Math.pow(window.InternalRadius,2))-((Math.pow(window.InternalRadius,2)*(window.SegmentTheta-Math.sin(window.SegmentTheta)))/2)
    window.SegmentP = (2*Math.PI*window.InternalRadius)-(window.InternalRadius*window.SegmentTheta);
  } else {
    window.SegmentH = window.PartFlowDepth;
    window.SegmentTheta = 2*Math.acos((window.InternalRadius-window.SegmentH)/window.InternalRadius);
    window.SegmentA = (Math.pow(window.InternalRadius,2)*(window.SegmentTheta-Math.sin(window.SegmentTheta)))/2
    window.SegmentP = window.InternalRadius*window.SegmentTheta;
  }
  window.SegmentHydR = window.SegmentA/window.SegmentP;
  window.SegmentVelocity = window.decimalflow/window.SegmentA;
  update();
}

function partialflowdelta(y) {
  var x = y[0]
  var AboveSpringline = window.decimalflow>(0.5*(window.ManningsCapacityGravityFlowFull/1000));
  if (AboveSpringline) {
    var SegmentH = window.InternalDiameter2 - x
    var SegmentTheta = 2*Math.acos((window.InternalRadius-SegmentH)/window.InternalRadius);
    var SegmentA = (Math.PI*Math.pow(window.InternalRadius,2))-((Math.pow(window.InternalRadius,2)*(SegmentTheta-Math.sin(SegmentTheta)))/2)
    var SegmentP = (2*Math.PI*window.InternalRadius)-(window.InternalRadius*SegmentTheta);
  } else {
    var SegmentH = x;
    var SegmentTheta = 2*Math.acos((window.InternalRadius-SegmentH)/window.InternalRadius);
    var SegmentA = (Math.pow(window.InternalRadius,2)*(SegmentTheta-Math.sin(SegmentTheta)))/2
    var SegmentP = window.InternalRadius*SegmentTheta;
  }
  var SegmentHydR = SegmentA/SegmentP;
  var SegmentVelocity = window.decimalflow/SegmentA;

  var Side1 = Math.pow(SegmentA,(5/3))/Math.pow(SegmentP,(2/3))
  var Side2 = window.ManningsCoefficient*window.decimalflow/Math.pow((window.Grade/100),0.5)

  return Math.abs(Side1 - Side2);
}

function update() {
  $("#circleflow").attr('data-percent',Math.round(window.PartFlowDepth/window.InternalDiameter2*100));
  $("#flow").html(window.decimalflow * 1000);
  $("#ManningsCap").html(window.ManningsCapacityGravityFlowFull);
  $("#HGLCAP").html(window.ColebrookWhiteCapacityFull);
  $("#ManningsRough").html(window.ManningsCoefficient);
  $("#PipeRough").html(window.mmPipeRoughness);
  $("#Velocity").html(window.Velocity);
  $("#PartVelocity").html(window.SegmentVelocity);
  $("#VelocityHead").html(window.VelocityHead);
  $("#PartFlow").html(window.PartFlowDepth);
  $("#FrictionSlope").html(window.FrictionSlope);
  $("#FrictionLoss").html(window.DarcyWeisbachMajorLoss);
  $("#PitLoss").html(window.UpstreamPitLoss);
  $("#PitLossCoeff").html(window.UpstreamPitLossCoeff);
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
  window.flow=35;

  calculate();
}
main();
