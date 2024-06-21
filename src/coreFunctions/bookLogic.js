import epub from 'epubjs';

export const parseEpubFile = (epubFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const epubBlob = new Blob([event.target.result], {
          type: "application/epub+zip",
        });
        const epubReader = epub(epubBlob);
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;

        const metadata = await epubReader.loaded.metadata;
        resolve({ toc, metadata, epubReader });
      } catch (error) {
        console.error("Error parsing EPUB file:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading EPUB file:", error);
      reject(error);
    };
    reader.readAsArrayBuffer(epubFile);
  });
};

export const populateChapterDropdown = (toc) => {
  const chapterDropdown = document.getElementById("chapterDropdown");
  chapterDropdown.innerHTML = "";

  const addChapterToDropdown = (chapter, index, isSubitem = false) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `${isSubitem ? "└ " : ""}${chapter.label}`;
    chapterDropdown.add(option);
  };

  toc.forEach((chapter, index) => {
    addChapterToDropdown(chapter, index);

    if (chapter.subitems && chapter.subitems.length > 0) {
      chapter.subitems.forEach((subitem, subitemIdx) => {
        const subitemIndex = `${index}.${subitemIdx}`;
        addChapterToDropdown(subitem, subitemIndex, true);
      });
    }
  });
};

export const getChapterPrompt = async (chapter, epubReader) => {
  const displayedChapter = await epubReader
    .renderTo("hiddenDiv")
    .display(chapter.href);
  return displayedChapter.contents.innerText.slice(0, 16000);
};

export const isNonStoryChapter = (chapterLabel) => {
  const nonStoryLabels = [
    "Title Page",
    "Cover",
    "Dedication",
    "Contents",
    "Copyright",
    "Endorsements",
    "Introduction",
    "Author",
    "About",
    "Map",
  ];
  return nonStoryLabels.some((label) =>
    chapterLabel.toLowerCase().includes(label.toLowerCase())
  );
};

export const getNextChapter = (toc, currentChapterIndex, currentSubitemIndex) => {
  let nextChapterIndex = currentChapterIndex;
  let nextSubitemIndex = currentSubitemIndex + 1;

  const currentChapter = toc[nextChapterIndex];
  if (currentChapter.subitems && currentChapter.subitems.length > 0) {
    if (nextSubitemIndex >= currentChapter.subitems.length) {
      nextChapterIndex++;
      nextSubitemIndex = 0;
    }
  } else {
    nextChapterIndex++;
    nextSubitemIndex = 0;
  }

  if (nextChapterIndex >= toc.length) {
    return null; // End of book
  }

  return { nextChapterIndex, nextSubitemIndex };
};