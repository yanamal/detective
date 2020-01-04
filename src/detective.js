// TODO: try putting in header
setup.cypromise = importScripts("https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.9.0/cytoscape.min.js");

var cy = null; // global variable for "current" cytoscape instance.
//TODO: make sure there's always only one? 

// Use a promise to do stuff after twine has loaded
var twineLoadedPromise = new Promise(function(resolve, reject) {
	// listen for changes to "data-init" property on the HTML element
	var initObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if(mutation.attributeName === "data-init") {
				// TODO: also probably check what the change is: expect the data-init attribute to be removed
				resolve();
				initObserver.disconnect();
			}
		});
	});
	initObserver.observe(document.documentElement, 
											 {attributes: true,});
});


// setup cytoscape graph of the deduction in the given container
var cysetup = function(cysel) {
	//(when library finishes importing):
	setup.cypromise.then(function () {
		// TODO: make sure previous one is removed?
		if(cy && cy.destroyed && !cy.destroyed()) {
			console.log("destroying old graph")
			cy.destroy()
		}
		cy = cytoscape({
			container: cysel,

			elements:  {
    nodes: [
      {
        data: { id: 'a' }
      },

      {
        data: { id: 'b' }
      }
    ],
    edges: [
      {
        data: { id: 'ab', source: 'a', target: 'b' }
      }
    ]
  },

			style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: {
						'background-color': '#666',
						'label': 'data(id)',
						'text-valign':'center'
					}
				},

				{
					selector: 'edge',
					style: {
						'width': 3,
						'line-color': '#ccc',
						'target-arrow-color': '#ccc',
						'target-arrow-shape': 'triangle'
					}
				}
			],

			layout: {
				name: 'grid',
				rows: 1
			}

		});
		cy.fit();
	});
}

// when passage finished loading, redraw the deduction graph 
// (since passage change makes everything recompute, and removes the dynamically-added graph)
// (and cytoscape automatically destroys stuff when a "non-headless" graph is removed from the view)
$(document).on(':passageend', function () {
	twineLoadedPromise.then(function () {
		// (note: this sets it up in exactly one container with this id, which is good, because there ideally should not be several containers with this id.)
		cysetup($('#cycontainer'))
	});
});

