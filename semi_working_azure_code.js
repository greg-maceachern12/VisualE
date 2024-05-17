const Epub = require("epub-gen");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

module.exports = async function (context, req) {
    context.log('Received request to generate EPUB.');

    const generatedBook = req.body;
    const filePath = `./Visuai_${generatedBook.title}.epub`;

    try {
        await new Epub(generatedBook, filePath).promise;
        context.log('EPUB file created successfully.');

        const stats = await fs.promises.stat(filePath);
        context.log(`File Path: ${filePath}, Size: ${stats.size} bytes`);

        const fileContent = await readFile(filePath, null);
        context.log('File read successfully for sending.');

        context.res = {
            status: 200,
            body: fileContent,
            isRaw: true,
            headers: {
                'Content-Type': 'application/epub+zip',
                'Content-Disposition': `attachment; filename="${generatedBook.title}.epub"`
            }
        };

        await unlink(filePath);
        context.log('EPUB file cleaned up after sending.');
    } catch (err) {
        context.log.error('Failed to generate or send EPUB:', err);
        context.res = {
            status: 500,
            body: 'Error generating or sending EPUB'
        };
    }
};
