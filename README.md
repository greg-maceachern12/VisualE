# Visuale

## Description
*Still under active development*

Visuale was created to help readers visualize authors descriptive language in books. It takes in a pdf or epub file (epub only for now) and analyzes each chapter for visually descriptive paragraphs/segments. It then sends those paragraphs to DALLE to generate an image based on that. Finally, it appends the image below the paragraph to help readers visualize different parts of a book.

## Example
### Text
> They neared the city-mountain, and Eragon saw that the white marble of Tronjheim was highly 
> polished and shaped into flowing contours, as if it had been poured into place. 
> It was dotted with countless round windows framed by elaborate carvings. A 
> colored lantern hung in each window, casting a soft glow on the surrounding 
> rock. No turrets or smokestacks were visible. Directly ahead, two 
> thirty-foot-high gold griffins guarded a massive timber gate—recessed twenty 
> yards into the base of Tronjheim—which was shadowed by thick trusses that 
> supported an arched vault far overhead.

### Image
![Example of GenAI image from Eragon](assets/eragonExample.jpeg)

## Usage
npm install
npm start

