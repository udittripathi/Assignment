
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Add this line

const app = express();
const port = 3000;

app.use(cors()); // Add this line to enable CORS
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/get-data', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/open-to-cors/assignment.json');
    const data = response.data;

    if (typeof data === 'object' && Array.isArray(data.products)) {
      const products = data.products;

      const sortedProducts = products.sort((a, b) => {
        const valueA = a.popularity;
        const valueB = b.popularity;
        return valueB - valueA;
      });

      res.json(sortedProducts);
    } else {
      console.error('Invalid data format: missing or invalid products property');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/performGetRequest', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/open-to-cors/assignment.json');
    const htmlOutput = generateSuccessHTMLOutput(response.data);
    res.send(htmlOutput);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function generateSuccessHTMLOutput(data) {
  var products1 = JSON.stringify(data.products);
  var products = JSON.parse(products1);
  var tdata = "<table><th>Title</th><th>Price</th>";
  var keys = Object.keys(products);
  var sort = [];

  for (let i = 0; i < keys.length; i++) {
    sort.push([
      products[keys[i]].title,
      products[keys[i]].price,
      products[keys[i]].popularity
    ]);
  }

  sort.sort(function(a, b) {
    var valueA, valueB;

    valueA = a[2];
    valueB = b[2];
    if (+valueA > +valueB) {
      return -1;
    } else if (+valueA < +valueB) {
      return 1;
    }
    return 0;
  });

  for (let j = 0; j < sort.length; j++) {
    tdata +=
      "<tr><td>" +
      sort[j][0] +
      "</td><td>" +
      sort[j][1] +
      "</td></tr>";  // Remove the empty <td>
  }
  tdata += "</table>";
  return tdata;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
