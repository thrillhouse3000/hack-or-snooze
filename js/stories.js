"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-${currentUser.favorites.find(s => s.storyId === story.storyId) ? 'solid' : 'regular'} fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavsOnPage() {
  console.debug("putStoriesOnPage");

  $favsList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favsList.append($story);
  }

  $favsList.show();
}

function putmyStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $myList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $story.prepend($('<i class="fa-regular fa-trash-can"></i>'))
    $myList.append($story);
  }

  $myList.show();
}

async function submitStory() {
  const storyAuthor = $storyAuthorInput.val();
  const storyTitle = $storyTitleInput.val();
  const storyUrl = $storyUrlInput.val();
  
  await storyList.addStory(currentUser, {author: storyAuthor,title: storyTitle,url: storyUrl});
  putStoriesOnPage();
}

$storyForm.on('submit', async function storySubmissionHandler (evt) {
  evt.preventDefault();
  await submitStory();
  $storyForm.slideUp('slow');
})

$allStoriesList.on('click', '.fa-star', function allStoriesFavoriteHandler (evt) {
  let targetId = evt.target.closest('li').id
  let story = storyList.stories.find(story => story.storyId === targetId)
  currentUser.favorites.find(story => story.storyId === targetId) ? currentUser.removeFavorite(targetId) : currentUser.addFavorite(story)
  $(evt.target).attr('class') === 'fa-regular fa-star' ? $(evt.target).attr('class', 'fa-solid fa-star') : $(evt.target).attr('class', 'fa-regular fa-star')
})

$favsList.on('click', '.fa-star', function favsFavoriteHandler (evt) {
  let targetId = evt.target.closest('li').id
  let story = storyList.stories.find(story => story.storyId === targetId)
  currentUser.favorites.find(story => story.storyId === targetId) ? currentUser.removeFavorite(targetId) : currentUser.addFavorite(story)
  putFavsOnPage();
})

$myList.on('click', '.fa-trash-can', async function removeHandler (evt) {
  let targetId = evt.target.closest('li').id
  await storyList.removeStory(targetId);
  putmyStoriesOnPage();
})

