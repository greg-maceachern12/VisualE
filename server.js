const express = require("express");
const cors = require("cors");
const Epub = require("epub-gen");
const app = express();
const port = 3001;
const fs = require("fs");

app.use(cors());
app.use(express.json());

const generatedBook = {
  title: "Generated Book",
  author: "Visuai",
  publisher: "Your Publisher",
  cover: "http://demo.com/url-to-cover-image.jpg",
  content: [],
};

app.post("/add-chapter", (req, res) => {
  const { chapterTitle, chapterText, imageUrl } = req.body;
  generatedBook.content.push({
    title: chapterTitle,
    data:
      `<body id='master-body'> \n` +
      `<img src='${imageUrl}' /> \n` +
      `<p>${chapterText}</p> \n` +
      `</body>`,
  });
  res.sendStatus(200);
});

app.get("/download-book", (req, res) => {
  console.log("Generated Book:", generatedBook);

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
