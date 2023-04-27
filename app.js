// pull in URL 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
//use D3 to to json
function init() {
    let dropdown = d3.select("#selDataset");
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let names = data.names; //make array of names
        names.forEach((name) => { // go through names and append 
            dropdown.append("option").text(name).property("value", name);
        });
        let name = names[0];
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

  // bar chart
function bar(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let sample = data.samples;
        let filterData = sample.filter((sample) => sample.id === selectedValue); // use .filter() to filter data
        let obj = filterData[0];
        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(), //.reverse to change order of data, slice for top 10 
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(165,179,243)"
            },
            orientation: "h" //horizontal
        }];
        
        Plotly.newPlot("bar", trace); // plot woth plotly
    });
}
  
//bubble chart
function bubble(selectedValue) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let filterData = samples.filter((sample) => sample.id === selectedValue); //.filter to filter by slected value
        let obj = filterData[0];
        let bub = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale:[120, 125, 130, 135, 140, 145] // plot layout
            }
        }];
        let layout = {
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", bub, layout); // plotly to plot 
    });
}

//demographics panel
function demo(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let metadata = data.metadata;
        let filterData = metadata.filter((meta) => meta.id == selectedValue); // filter by paramters 
        let obj = filterData[0]
        d3.select("#sample-metadata").html("");
        let entries = Object.entries(obj); // key pairs 
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
        console.log(entries); //console log object entries 
    });
  }

//change values
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();