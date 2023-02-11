const axios = require("axios");

// Replace these variables with your actual TikTok API v2 key and the user id of the user you want to monitor
const apiKey = "Your TikTok API v2 Key";
const userId = "TikTok User Id";

// This function makes a request to the TikTok API v2 to get the latest posts by the specified user
async function getTikTokPosts() {
  const response = await axios.get(
    `https://api2.musical.ly/aweme/v1/aweme/post/?user_id=${userId}&count=1&sec_uid=&max_cursor=0&aid=1180&_signature=0`,
    {
      headers: {
        "X-Tiktok-Vendor": apiKey
      }
    }
  );
  return response.data.aweme_list;
}

// This function posts to Mastodon using the provided Mastodon API endpoint and access token
async function postToMastodon(text, accessToken, apiEndpoint) {
  const response = await axios.post(`${apiEndpoint}/api/v1/statuses`, {
    status: text
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

// Use this function to monitor TikTok for new posts and post them to Mastodon
async function monitorTikTok() {
  // Replace these variables with your actual Mastodon API endpoint and access token
  const mastodonAccessToken = "Your Mastodon Access Token";
  const mastodonApiEndpoint = "https://mastodon.social";

  const posts = await getTikTokPosts();
  if (posts.length > 0) {
    // Get the latest post
    const latestPost = posts[0];
    const postText = latestPost.desc;
    // Post the text of the latest post to Mastodon
    await postToMastodon(postText, mastodonAccessToken, mastodonApiEndpoint);
    console.log(`Successfully posted "${postText}" to Mastodon`);
  } else {
    console.log("No new posts found on TikTok");
  }
}

// Call the monitorTikTok function
monitorTikTok();
