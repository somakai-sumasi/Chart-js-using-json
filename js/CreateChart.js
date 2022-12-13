const borderColor = [
  "rgba(201, 79, 105, 1)",
  "rgba(42, 127, 184, 1)",
  "rgba(204, 168, 69, 1)",
  "rgba(55, 140, 140, 1)",
  "rgba(122, 82, 204, 1)",
  "rgba(204, 128, 51, 1)",
];

const backgroundColor = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

window.onload = function () {
  const ctxs = document.querySelectorAll('[id^="chart"]');

  ctxs.forEach(function (ctx) {
    CallChart(ctx);
  });
};

function CallChart(ctx) {
  const type = ctx.dataset.type;
  const source = ctx.dataset.source;

  fetch((usl = "../data/" + source + ".json"))
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      switch (type) {
        //グラフパターン選択
        case "BarY":
          CreateBarYChart(ctx, json);
          break;

        case "BarX":
          CreateBarXChart(ctx, json);
          break;

        case "Doughnut":
          CreateDoughnutChart(ctx, json);
          break;

        case "Pie":
          CreatePieChart(ctx, json);
          break;

        default:
      }
    })
    .catch((error) => {
      console.log("エラー");
    });
}

//各クラスに任せる
function CreateChart(ctx, json, type, options) {
  const data = {
    labels: json["labels"],
    datasets: [
      {
        label: json["label"],
        data: json["data"],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  var ex_chart = new Chart(ctx, {
    type: type,
    data: data,
    options: options,
    plugins: [ChartDataLabels],
  });
}

function CreateBarChart(ctx, json, options) {
  CreateChart(ctx, json, "bar", options);
}

//縦棒グラフ
function CreateBarYChart(ctx, json) {
  const options = {
    indexAxis: "x",
    plugins: CreatePlugins(json),
  };
  CreateBarChart(ctx, json, options);
}
//横棒グラフ
function CreateBarXChart(ctx, json) {
  const options = {
    indexAxis: "y",
    plugins: CreatePlugins(json),
  };
  CreateBarChart(ctx, json, options);
}
//円(穴あき)グラフ
function CreateDoughnutChart(ctx, json) {
  const options = { plugins: CreatePlugins(json) };
  CreateChart(ctx, json, "doughnut", options);
}

//円(穴無し)グラフ
function CreatePieChart(ctx, json) {
  const options = { plugins: CreatePlugins(json) };
  CreateChart(ctx, json, "pie", options);
}

function CreatePlugins(json) {
  const unit = json["unit"] != undefined ? json["unit"] : null;

  const plugins = {
    tooltip: {
      enabled: false,
    },
    datalabels: {
      borderColor: "rgba(255, 255, 255, 1)",
      borderRadius: 25,
      borderWidth: 0,
      color: "white",
      display: function (context) {
        var dataset = context.dataset;
        var count = dataset.data.length;
        var value = dataset.data[context.dataIndex];
        return value > count;
      },
      font: {
        weight: "bold",
      },
      padding: 6,
      formatter: function (value, context) {
        return (
          value.toString() + unit
        );
      },
    },
  };
  return plugins;
}
