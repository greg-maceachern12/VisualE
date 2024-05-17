const express = require("express");
const cors = require("cors");
const Epub = require("epub-gen");
const app = express();
const port = 3001;
const fs = require("fs");

app.use(cors());
app.use(express.json());

app.post("/download-book", (req, res) => {

  console.log("Generated Book:", req.body);
  const generatedBook = req.body;
  const filePath = `./Visuai_${generatedBook.title}.epub`;

  new Epub(generatedBook, filePath).promise
    .then(() => {
      console.log("File Path:", filePath);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return res.status(500).send("Error getting file stats");
        }

        console.log("File Size:", stats.size, "bytes");
        console.log(res)
        res.download(filePath, (err) => {
          if (err) {
            console.error("Error downloading EPUB:", err);
            return res.status(500).send("Error downloading EPUB");
          }

          console.log("Response Headers:", res.getHeaders());

          // Clean up the generated EPUB file after download
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting EPUB file:", err);
            }
          });
        });
      });
    })
    .catch((err) => {
      console.error("Error generating EPUB:", err);
      res.status(500).send("Error generating EPUB");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
