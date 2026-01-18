# Messaging App Simulator for Authors
Create a story in the format of iOS Messages App using this tool.
- Easy to use
- Plenty of usage examples
- Almost no coding experience needed
- Runs on any web browser without any set up (static HTML, meaning it is simple to host)

## Run
Open `index.html` in a web browser (Firefox, Chrome, etc).

## Add New Story
1. Make a copy of the template folder: `story/template` and name the new copy. For example: `story/my-story`.
1. Also rename the story file: `story/my-story/template.js`. For example: `story/my-story/my-story.js` or `story/my-story/chapter-1.js`.

![add-new-story](images/add-new-story.png)

3. Add the story into `index.html`:
```html
<script src="story/my-story/chapter-1.js"></script>
```
4. Open `index.html` in a web browser or refresh the page

## Usage Examples
There are comprehensive examples in the tutorial and unit tests located at:
```bash
story/tutorial/tutorial.js
story/debug/unit-tests.js
```

## Advice/Tips
- Put all your images and videos in the story folder. For example:
```bash
story/my-story/images
story/my-story/videos
```
- Recommended to use `Visual Studio Code` to write up your story
- Just follow the `tutorial` and `unit-tests`, it should cover everything you possibly may want to do
- Some functions need `await`, don't forget it. Reference off the `unit-tests` if you're unsure.
- Look at `api.ts` for the full supported API documentation
