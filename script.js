class Graph {
    constructor(size) {
        this.adjMatrix = Array.from({ length: size }, () => Array(size).fill(0));
        this.vertexData = [];
    }

    addEdge(u, v, weight) {
        const uIndex = this.vertexData.indexOf(u);
        const vIndex = this.vertexData.indexOf(v);
        if (uIndex !== -1 && vIndex !== -1) {
            this.adjMatrix[uIndex][vIndex] = weight;
            this.adjMatrix[vIndex][uIndex] = weight; // Undirected graph
        }
    }

    dijkstra(startVertex) {
        const startIndex = this.vertexData.indexOf(startVertex);
        const distances = Array(this.vertexData.length).fill(Infinity);
        distances[startIndex] = 0;
        const visited = Array(this.vertexData.length).fill(false);

        for (let i = 0; i < this.vertexData.length; i++) {
            let minDistance = Infinity;
            let u = -1;

            for (let j = 0; j < this.vertexData.length; j++) {
                if (!visited[j] && distances[j] < minDistance) {
                    minDistance = distances[j];
                    u = j;
                }
            }

            if (u === -1) break;

            visited[u] = true;

            for (let v = 0; v < this.vertexData.length; v++) {
                if (this.adjMatrix[u][v] !== 0 && !visited[v]) {
                    const alt = distances[u] + this.adjMatrix[u][v];
                    if (alt < distances[v]) {
                        distances[v] = alt;
                    }
                }
            }
        }
        return distances;
    }

    getShortestPath(source, destination) {
        const distances = this.dijkstra(source);
        const destIndex = this.vertexData.indexOf(destination);
        return distances[destIndex];
    }
}

const graph = new Graph(7); // Adjust size as needed

function addVertex() {
    const vertexInput = document.getElementById('vertexInput').value.trim();
    if (vertexInput && !graph.vertexData.includes(vertexInput)) {
        graph.vertexData.push(vertexInput);
        document.getElementById('vertexInput').value = '';
        alert(`Vertex ${vertexInput} added.`);
        drawGraph(); // Redraw graph when a vertex is added
    } else {
        alert('Invalid vertex name or already exists.');
    }
}

function addEdge() {
    const from = document.getElementById('edgeFrom').value.trim();
    const to = document.getElementById('edgeTo').value.trim();
    const weight = parseInt(document.getElementById('edgeWeight').value, 10);

    if (from && to && !isNaN(weight)) {
        graph.addEdge(from, to, weight);
        document.getElementById('edgeFrom').value = '';
        document.getElementById('edgeTo').value = '';
        document.getElementById('edgeWeight').value = '';
        alert(`Edge from ${from} to ${to} with weight ${weight} added.`);
        drawGraph(); // Redraw graph when an edge is added
    } else {
        alert('Invalid input for edge.');
    }
}

function runDijkstra() {
    const startVertex = document.getElementById('startVertex').value.trim();
    const distances = graph.dijkstra(startVertex);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (distances.length) {
        distances.forEach((distance, index) => {
            resultsDiv.innerHTML += `<p>Distance from ${startVertex} to ${graph.vertexData[index]}: ${distance === Infinity ? '∞' : distance}</p>`;
        });
    } else {
        resultsDiv.innerHTML = '<p>No distances calculated.</p>';
    }
}

function getShortestDistance() {
    const source = document.getElementById('sourceVertex').value.trim();
    const destination = document.getElementById('destinationVertex').value.trim();
    const distance = graph.getShortestPath(source, destination);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (distance !== undefined) {
        resultsDiv.innerHTML += `<p>Shortest distance from ${source} to ${destination}: ${distance === Infinity ? '∞' : distance}</p>`;
    } else {
        resultsDiv.innerHTML = '<p>Invalid source or destination.</p>';
    }
}

function drawGraph() {
    const nodes = new vis.DataSet(graph.vertexData.map((vertex, index) => ({ id: index, label: vertex })));
    const edges = new vis.DataSet([]);

    for (let i = 0; i < graph.vertexData.length; i++) {
        for (let j = 0; j < graph.vertexData.length; j++) {
            if (graph.adjMatrix[i][j] !== 0) {
                edges.add({ from: i, to: j, label: graph.adjMatrix[i][j].toString() });
            }
        }
    }

    const container = document.getElementById('mynetwork');
    const data = { nodes: nodes, edges: edges };
    const options = {};
    const network = new vis.Network(container, data, options);
}
