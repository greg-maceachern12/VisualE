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
      data:
        "<h2>Charles Lutwidge Dodgson</h2>" +
        '<div lang="en">Better known by the pen name Lewis Carroll...</div>', // pass html string
    },
    // chapter 2
    {
      title: "Chapter 1: Down the Rabbit Hole",
      data:
        "<img src='https://upload.wikimedia.org/wikipedia/en/3/35/Dune_2021-Sandworm.jpg' />" +
        "<p>Alice was beginning to get very tired...</p>" +
        "<p>New Line for text </p>",
    },
    //chapter 3
    {
      title: "Chapter 2: Into the Hills",
      data:
        "<img src='https://upload.wikimedia.org/wikipedia/en/3/35/Dune_2021-Sandworm.jpg' />" +
        "<p>Alice was beginning to get very tired...</p>" +
        "<p>New Line for text </p>",
    },
    {
      title: "Chapter 3: I don't think so",
      data:
      '  <body xmlns="http://www.w3.org/1999/xhtml">\n' +
        '  <head xmlns="http://www.w3.org/1999/xhtml"><base href="http://localhost:3000/EPUB/chap_03.xhtml" />\n' +
        "    <title>Chapter 3: The Confrontation</title>\n" +
        '  <link rel="canonical" href="/EPUB/chap_03.xhtml" /><meta name="dc.identifier" content="chapter_2" /><meta name="dc.relation.ispartof" content="id123456" /><meta name="dc.relation.ispartof" content="id123456" /><meta name="dc.relation.ispartof" content="id123456" /></head>\n' +
        "<img src='https://www.outdoorpainter.com/wp-content/uploads/2015/04/f8b84457f79954b52239c255e44b3bb1.jpg' />" +
        "    <h1>Chapter 3: The Confrontation</h1>\n" +
        "    <p>As they approached Glacialis, the air grew colder and the sense of impending doom more palpable. The crystal city, once a beacon of light and hope, now lay shrouded in darkness, its spires covered in thick layers of ice. The Shadow Blight had already begun its invasion, and time was running out.</p>\n" +
        "    <p>Lysara and her companions fought their way through the city's outer defenses, battling hordes of corrupted creatures. The streets, once vibrant and filled with life, were now eerily silent, save for the sounds of battle. Each step they took brought them closer to the heart of the city and the source of the corruption.</p>\n" +
        "    <p>As they made their way through the city, they encountered survivors—residents of Glacialis who had managed to evade the Shadow Blight's forces. These survivors joined Lysara's cause, their hope rekindled by her presence and determination. With their help, Lysara learned more about the city and its secrets, gaining valuable allies and resources for the final battle.</p>\n" +
        "    <p>The journey through Glacialis was a series of skirmishes and strategic maneuvers. They faced corrupted ice golems, shadow wraiths, and monstrous creatures twisted by dark magic. Each encounter tested their skills and resolve, but they pressed on, driven by their mission.</p>\n" +
        "    <p>As they reached the inner sanctum of the city, they encountered a powerful lieutenant of the Shadow Blight—a dark sorcerer named Morgrath. Clad in black ice armor and wielding a staff of shadows, Morgrath was a formidable opponent. He taunted Lysara, mocking her efforts and claiming that the Crystal Throne would never be hers.</p>\n" +
        "    <p>The battle with Morgrath was intense and brutal. Lysara and her companions fought with everything they had, using their unique abilities and strengths to counter his dark magic. It was a battle of attrition, each side pushing the other to the brink. In a final, desperate move, Lysara channeled the power of the shards and the amulet, unleashing a wave of energy that shattered Morgrath's defenses and defeated him.</p>\n" +
        "    <p>With Morgrath vanquished, they continued their advance towards the Throne Room, the epicenter of the Shadow Blight's power. The air grew thick with darkness, and the very ground seemed to pulse with malevolence. Lysara could feel the weight of the prophecy pressing down on her, the enormity of her task clear.</p>\n" +
        "    <p>As they entered the Throne Room, they were confronted by the Shadow Blight itself, a towering figure of darkness and ice. Its eyes glowed with malevolent intelligence, and its voice echoed with the whispers of a thousand tormented souls.</p>\n" +
        "    <p>'Foolish child,' the Shadow Blight hissed. 'You cannot hope to defeat me. The power of the Throne is mine to command.'</p>\n" +
        "    <p>Lysara stepped forward, her resolve unshaken. 'The Throne belongs to Arctara, not to darkness. I will restore the balance and free this land from your grasp.'</p>\n" +
        "    <p>The battle that ensued was fierce and unforgiving. The Shadow Blight unleashed torrents of dark ice, but Lysara countered with the pure energy of the shards. Her companions fought valiantly by her side, their combined strength pushing back the darkness inch by inch.</p>\n" +
        "    <p>In the final moments of the battle, Lysara reached the Crystal Throne and placed the shards in their rightful places. A brilliant light erupted from the Throne, enveloping her in a radiant aura. With a cry of determination, she channeled the Throne's power and unleashed a wave of pure energy that shattered the Shadow Blight's form.</p>\n" +
        "    <p>As the darkness dissipated, the city of Glacialis began to thaw, its crystalline beauty restored. Lysara stood before the Throne, now a beacon of light and hope once more. The prophecy had been fulfilled, and Arctara was saved.</p>\n" +
        "    <p>With the Shadow Blight defeated and the Crystal Throne restored, Lysara knew that her journey was far from over. She had discovered her true destiny, and with her newfound power, she would continue to protect Arctara and ensure that the balance of light and dark remained unbroken.</p>\n" +
        "    <p>Thus began a new era for Arctara, one of peace and prosperity, guided by the strength and wisdom of Lysara, the savior of the Crystal Throne.</p>\n" +
        "  </body>\n",
    },
  ],
};
console.log(option.content);
new Epub(option, `./Visuai_${option.title}.epub`);
