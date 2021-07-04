function optionChanged(selected = '940') {d3.json('samples.json').then(function(data) {
    // Populate the dropdown with options
    var names = data.names
    var parent1 = document.getElementById('selDataset')
    for (i = 0; i < names.length; i++) {
        var child = document.createElement('option');
        child.value = names[i];
        child.text = names[i];
        parent1.appendChild(child);
    };

    // Find the data pertaining to the selected sample
    var parent2 = document.getElementById('sample-metadata')
    var child2 = parent2.appendChild(document.getElementById('metadata-info'))
    child2.innerHTML = null;
    data.metadata.forEach(element => {
        if (element['id'] === parseInt(selected)) {
            metadata = element
            for (i in metadata) {
                var grandchild = document.createElement('li');
                var text = `${i}: ${metadata[i]}`
                grandchild.innerHTML = text;
                child2.appendChild(grandchild);
            }
        }
    });

    // otu_ids are stored within data.samples
    // Need to write a loop to grab all of the info for the requested sample
    var otu_ids
    var sample_values
    var otu_labels

    data.samples.forEach(element => {
        if (element['id'] === selected) {
            otu_ids = element['otu_ids'];
            sample_values = element['sample_values'];
            otu_labels = element['otu_labels']
            
        }
    });
    var otu_info = []
    for (i = 0; i < otu_labels.length; i++) {
        otu_info.push({
            otu_id: otu_ids[i],
            otu_label: otu_labels[i],
            sample_value: sample_values[i]
        })
    }
    
    // Create bubble chart first since we don't need to manipulate the data at all
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    };

    var plot_data = [trace1];
    var layout = {
        title: 'Fuck yeah, I am great.'
    }
    Plotly.newPlot('bubble', plot_data, layout)

    // Sort and slice the data for the bar chart and blatantly stop naming variables so pythonically
    var sortedOtuInfo = otu_info.sort(function sortFunction(a, b) {
        return b.sample_value - a.sample_value;
      });
    var slicedOtuInfo = sortedOtuInfo.slice(0, 10).reverse();

    var otu_ids = [];
    var otu_labels = [];
    var sample_values = [];

    console.log(slicedOtuInfo);

    slicedOtuInfo.forEach(element => {  
        var prefix = 'OTU '  
        otu_ids.push(prefix.concat(element['otu_id']));
        sample_values.push(element['sample_value']);
        otu_labels.push(element['otu_label'])
    });

    console.log(otu_ids)

    // Bar Graph
    var trace1 = {
        y: otu_ids,
        x: sample_values,
        text: otu_labels,
        type: "bar",
        orientation: 'h'
    };

    var plot_data = [trace1];

    var layout = {
        title: 'Holy Fuck, it worked'
    };
    Plotly.newPlot('bar', plot_data, layout)
});
};
optionChanged();