# Study AI

- Rebuilt version of [StudyAI](https://github.com/marcusgchan/study-ai) that fixes some of the bugs, redesigned arcitecture, and has new features

## Inspiration

As our world becomes more digitally immersed, the attention span of humans has taken a toll due to the distractions that come with our digital world. One of the biggest affects that digital devices have are on students during classes. Our goal at StudyAI is to help solve this by creating an app, not only targeted towards students with ADHD, but to help any type of students that may have an attention deficiency in class. The solution we provide, is a way that integrates digital technology into students' devices so that they can focus in class while having an engaging UI to help them pay attention better and generate notes that have direct correlations to the class transcriptions.

## What it does

StudyAI, performs speech-to-text transcriptions that contains highlighted keywords through an AI generated keyword algorithm. Additionally, provides note-taking features that contain lexical formatting (e.g. indents, bullet points, etc.) to give end users accessibility to write down notes in a parallel manner, with no interferences.

## How we built it

We utilized the [T3 Stack](https://create.t3.gg/), a full-stack type safety technology stack, to build our user authentication, frontend UI, and backend CRUD operations of our application. Additionally, we used AI and the web-scraping of various documents to generate keywords based on the user's topic. With those keywords, we classified words spoken by a lecturer identified by our speech-to-text pipeline and formatted them in a understandable way.

## Challenges we ran into

One challenge that we ran into was that the library we used for creating a text editor was in beta, resulting in very limited documentation. To overcome this problem, we had to experiment a lot with the code and increase our patience!

## Accomplishments that we're proud of

We're proud of completing a full-functional web application with various technologies that we had no prior experience with in a tight deadline.

## What we learned

We learned how to use speech-to-text APIs, generating keywords from various topics, and integrating a text editor to allow for accessible note taking.

## What's next for Study AI

- create additional features according to our clients feedback
- improve responsiveness of our app
- linking note editor text to transcript generation
