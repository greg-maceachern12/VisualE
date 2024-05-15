const Epub = require("epub-gen");

const option = {
    title: "Alice's Adventures in Wonderland", // *Required, title of the book.
    author: "Lewis Carroll", // *Required, name of the author.
    publisher: "Macmillan & Co.", // optional
    cover: "http://demo.com/url-to-cover-image.jpg", // Url or File path, both ok.
    content: [
        //Chapter 1
        {
            title: "About the author", // Optional
            author: "John Doe", // Optional
            data: "<h2>Charles Lutwidge Dodgson</h2>"
            +"<div lang=\"en\">Better known by the pen name Lewis Carroll...</div>" // pass html string
        },
        // chapter 2
        {
            title: "Chapter 1: Down the Rabbit Hole",
            data: "<img src='https://oaidalleapiprodscus.blob.core.windows.net/private/org-zB0MfF24tvGcepOWPHM19vuR/user-FmOB286Df5vs0stAPDec4yYg/img-D5XYUm7zToRXxlA00X4BPR93.png?st=2024-05-15T13%3A22%3A34Z&se=2024-05-15T15%3A22%3A34Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-15T13%3A55%3A08Z&ske=2024-05-16T13%3A55%3A08Z&sks=b&skv=2021-08-06&sig=SzghryKGMcsV5cqsfsNZeGGNox1NAVRZOCxymQUBLic%3D' />"
            +"<p>Alice was beginning to get very tired...</p>"
            + "<p>New Line for text </p>"
        },
       //chapter 3
        {
            title: "Chapter 2: Into the Hills",
            data: "<img src='https://oaidalleapiprodscus.blob.core.windows.net/private/org-zB0MfF24tvGcepOWPHM19vuR/user-FmOB286Df5vs0stAPDec4yYg/img-a2snqUoZp3Ed0KkjCrBiaWYf.png?st=2024-05-15T13%3A25%3A03Z&se=2024-05-15T15%3A25%3A03Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-14T16%3A20%3A44Z&ske=2024-05-15T16%3A20%3A44Z&sks=b&skv=2021-08-06&sig=OKxnaaiPRlv7LZ87e%2BNObyEVT5EOa7Sxue32wG3UcUA%3D' />"
            +"<p>Alice was beginning to get very tired...</p>"
            + "<p>New Line for text </p>"
        },
        {
            title: "Chapter 3: I don't think so",
            data: "<p>This is the way she goes....</p>"
        }
    ]
};

new Epub(option, `./Visuai_${option.title}.epub`);
