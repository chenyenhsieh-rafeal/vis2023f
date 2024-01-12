function _1(md){return(
md`# # HW2 Strong baseline`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _Counts(){return(
[]
)}

function _constellations(data){return(
data.map(item => item.Constellation)
)}

function _CCounts(Counts,constellations,data)
{
  Counts.length = 0; //將yCounts清空
  var minConstellation = Math.min(...constellations); //最早出生年
  var maxConstellation = Math.max(...constellations); //最晚出生年
  for (var y=minConstellation; y<=maxConstellation; y++) { 
    Counts.push({constellation:y, gender:"male", count:0}); 
    //Object包含：1. 出生年，2.男性，3.人數(設為0)
    Counts.push({constellation:y, gender:"female", count:0}); 
    //Object包含：1. 出生年，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Constellation-minConstellation)*2 + (x.Gender== "男" ? 0 : 1); 
    Counts[i].count++;
    //讀取data array，加總每個年份出生的人
  })
  return Counts
}


function _constellationMapping(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座" ,"水瓶座", "雙魚座"]
)}

function _transformedData(CCounts,constellationMapping){return(
CCounts.map(item => ({
    ...item,
    constellation: constellationMapping[item.constellation]
}))
)}

function _8(md){return(
md`# bar chart`
)}

function _9(Plot,transformedData){return(
Plot.plot({
  grid: true,
  y: {label: "count"},
  color: {
    domain: ['male', 'female'],
    range: ['#FF0000', '#00FF00'], //可以根據需要更改顏色
    legend: true
  },
  marks: [
    Plot.barY(transformedData, {x: "constellation", y: "count", fill:"gender", tip: true}),
    Plot.ruleY([0]),
  ]
})
)}

function _10(md){return(
md`# histogram`
)}

function _11(Plot,data,constellationMapping){return(
Plot.plot({
  width:800,
  grid: true,
  y: {label: "count"},
  color: {
    domain: ['男', '女'],
    range: ['#FF0000', '#00FF00'], //可以根據需要更改顏色
    legend: true
  },
  marks: [
    Plot.rectY(data, Plot.binX({y:"count"}, {x: "Constellation", interval:1, fill:"Gender", tip: true})),
    Plot.axisX({
      tickFormat: d => {
        return constellationMapping[d]; 
      },
    }),
    Plot.ruleY([0]),
  ],
  
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("Counts")).define("Counts", _Counts);
  main.variable(observer("constellations")).define("constellations", ["data"], _constellations);
  main.variable(observer("CCounts")).define("CCounts", ["Counts","constellations","data"], _CCounts);
  main.variable(observer("constellationMapping")).define("constellationMapping", _constellationMapping);
  main.variable(observer("transformedData")).define("transformedData", ["CCounts","constellationMapping"], _transformedData);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Plot","transformedData"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["Plot","data","constellationMapping"], _11);
  return main;
}
