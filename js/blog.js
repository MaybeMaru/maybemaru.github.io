var container = document.getElementById("posts");

var posts = [
    "05-04-2025"
];

function getTitle(post) {
  const match = post.match(/^# (.+)/m);
  return match ? match[1].trim() : "Untitled";
}

function getFirstParagraph(markdownText)
{
  const noFrontmatter = markdownText.replace(/^---[\s\S]*?---/, '');
  const lines = noFrontmatter.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (
      line &&
      !line.startsWith('#') &&
      !line.startsWith('-') &&
      !line.startsWith('*') &&
      !line.match(/^\d+\./) &&
      !line.startsWith('>') &&
      !line.startsWith('![') &&
      !line.startsWith('```') &&
      !line.startsWith('    ')
    ) {
      return line;
    }
  }
  return null;
}

async function loadPosts(posts) {
    for (const file of posts.reverse()) {
        const res = await fetch('blogposts/' + file + '.md');
        const text = await res.text();
    
        const postTitle = getTitle(text);
        const postSummary = getFirstParagraph(text);

        const post = document.createElement('body');
        post.className = "blogpost-body";
        container.appendChild(post);

        post.style.cursor = 'pointer';
        post.onclick = () => {
            window.location.href = 'blogpost.html?post=' + file;
          };

        const title = document.createElement('h1');
        title.innerHTML = postTitle;
        post.appendChild(title);

        const date = document.createElement('h3');
        date.innerHTML = "Posted on: " + file.split("-").join(" - ");
        post.appendChild(date);

        const summary = document.createElement('p');
        summary.innerHTML = postSummary;
        post.appendChild(summary);
    };
}

loadPosts(posts);